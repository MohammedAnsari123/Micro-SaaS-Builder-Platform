import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

app = FastAPI(title="CodeAra Analytics Engine", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
def get_mongo_client():
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/saasforge")
    try:
        client = MongoClient(mongo_uri)
        # Check connection
        client.admin.command('ping')
        return client
    except Exception as e:
        print(f"[Python API] Error connecting to MongoDB: {e}")
        return None

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Python Analytics Engine"}

@app.get("/analytics/{tenant_id}")
def get_tenant_analytics(tenant_id: str):
    """
    Query MongoDB dynamically to aggregate total orders, total revenue, 
    and average ticket value for a specific tenant.
    """
    client = get_mongo_client()
    if not client:
        raise HTTPException(status_code=500, detail="Database connection failed")

    try:
        db = client.get_database()
        orders_col = db.get_collection("orders")

        # MongoDB aggregation pipeline for a single tenant
        pipeline = [
            {
                "$match": {
                    # Handle both string and ObjectId inputs if necessary
                    "$or": [
                        {"tenantId": tenant_id},
                        {"tenantId": {"$regex": f"^{tenant_id}$", "$options": "i"}}
                    ]
                }
            },
            {
                "$group": {
                    "_id": "$tenantId",
                    "total_orders": {"$sum": 1},
                    "total_revenue": {"$sum": "$total"},
                    "average_ticket": {"$avg": "$total"}
                }
            }
        ]

        aggregates = list(orders_col.aggregate(pipeline))
        
        if not aggregates:
            return {
                "tenant_id": tenant_id,
                "total_orders": 0,
                "total_revenue": 0.0,
                "average_ticket": 0.0,
                "message": "No transaction records found for this tenant"
            }

        data = aggregates[0]
        return {
            "tenant_id": tenant_id,
            "total_orders": data["total_orders"],
            "total_revenue": float(data["total_revenue"]) if data["total_revenue"] else 0.0,
            "average_ticket": float(data["average_ticket"]) if data["average_ticket"] else 0.0
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Aggregation error: {str(e)}")
    finally:
        client.close()

@app.post("/analytics/report/{tenant_id}")
def generate_report(tenant_id: str):
    """
    Triggers CSV report generation and writes it to the local reports directory.
    """
    stats = get_tenant_analytics(tenant_id)
    
    report_dir = "./analytics-reports"
    if not os.path.exists(report_dir):
        os.makedirs(report_dir)

    report_path = f"{report_dir}/report_{tenant_id}.csv"
    try:
        with open(report_path, "w") as f:
            f.write("metric,value\n")
            f.write(f"total_orders,{stats['total_orders']}\n")
            f.write(f"total_revenue,{stats['total_revenue']:.2f}\n")
            f.write(f"average_ticket_value,{stats['average_ticket']:.2f}\n")
        
        return {"success": True, "report_path": report_path, "stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate CSV: {str(e)}")
