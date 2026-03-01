import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, User, RefreshCw, Tag } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, eachDayOfInterval } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const CalendarView = ({ instance }) => {
    const collectionName = instance?.collectionName || 'events';
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
                const res = await axios.get(`http://localhost:5000/api/v1/dynamic/${collectionName}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error(`Failed to fetch ${collectionName}:`, err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [collectionName]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-xl shadow-blue-500/5">
                    <CalendarIcon className="w-7 h-7 text-blue-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Global Schedule Matrix</p>
                </div>
            </div>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-lg">
                <button onClick={prevMonth} className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
                    <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-slate-800 mx-1" />
                <button onClick={nextMonth} className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (
            <div className="grid grid-cols-7 gap-px mb-2">
                {days.map(day => (
                    <div key={day} className="py-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">{day}</div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const dayEvents = data.filter(event => isSameDay(new Date(event.date || event.createdAt), cloneDay));

                days.push(
                    <div
                        key={day.toString()}
                        className={`min-h-[140px] relative border border-slate-800/50 p-3 transition-all cursor-pointer group ${!isCurrentMonth ? 'bg-slate-950/20 opacity-30 shadow-inner' : 'bg-slate-900/30 hover:bg-slate-800/40'} ${isSelected ? 'ring-2 ring-blue-500/50 bg-blue-500/5 z-10' : ''}`}
                        onClick={() => setSelectedDate(cloneDay)}
                    >
                        <span className={`text-xs font-black ${isCurrentMonth ? 'text-slate-400' : 'text-slate-700'} ${isSameDay(day, new Date()) ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-lg shadow-lg' : ''}`}>
                            {formattedDate}
                        </span>

                        <div className="mt-4 space-y-1.5 overflow-hidden">
                            {dayEvents.slice(0, 3).map((event, idx) => (
                                <div key={idx} className="px-2 py-1 bg-slate-800 border border-slate-700/50 rounded-lg flex items-center gap-1.5 shadow-sm overflow-hidden">
                                    <div className="w-1 h-1 rounded-full bg-blue-500 shrink-0 shadow-glow shadow-blue-500/50" />
                                    <span className="text-[10px] text-slate-300 font-bold truncate">{event.name || event.title || 'Event'}</span>
                                </div>
                            ))}
                            {dayEvents.length > 3 && (
                                <div className="text-[9px] font-black text-blue-500/60 ml-2 uppercase tracking-tighter">+{dayEvents.length - 3} More Items</div>
                            )}
                        </div>
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(<div className="grid grid-cols-7 gap-px" key={day.toString()}>{days}</div>);
            days = [];
        }
        return <div className="border border-slate-800/50 bg-slate-800/20 rounded-[2.5rem] overflow-hidden shadow-2xl">{rows}</div>;
    };

    return (
        <div className="flex flex-col lg:flex-row gap-10 h-full w-full group/calendar">
            <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                    {renderHeader()}
                    <div className="flex items-center gap-4 mr-4">
                        <button onClick={() => fetchData()} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-blue-600/20">
                            <Plus className="w-4 h-4" /> New Event
                        </button>
                    </div>
                </div>
                {renderDays()}
                {renderCells()}
            </div>

            {/* Event Side Rail */}
            <div className="w-full lg:w-96 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col shadow-3xl">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg">
                        <Clock className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white leading-none mb-1">{format(selectedDate, 'do MMMM')}</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Selected Cycle Window</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                    {data.filter(e => isSameDay(new Date(e.date || e.createdAt), selectedDate)).length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-10">
                            <Tag className="w-16 h-16 mb-4" />
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-center">Empty Signal Buffer</p>
                        </div>
                    ) : (
                        data.filter(e => isSameDay(new Date(e.date || e.createdAt), selectedDate)).map((event, i) => (
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i} className="p-6 rounded-[2rem] bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/30 transition-all group/event cursor-pointer">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="px-2.5 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-tighter border border-blue-500/20">
                                        {event.type || 'Operational'}
                                    </div>
                                    <div className="h-px bg-slate-800 flex-1" />
                                    <span className="text-[10px] font-mono text-slate-600 uppercase">{format(new Date(event.date || event.createdAt), 'HH:mm')}</span>
                                </div>
                                <h4 className="text-sm font-black text-white leading-relaxed mb-4">{event.name || event.title || 'Untitled Event'}</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <MapPin className="w-3.5 h-3.5" />
                                        <span className="font-medium">{event.location || 'Distributed Node'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <User className="w-3.5 h-3.5" />
                                        <span>System Origin</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                <button className="mt-8 w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-all">
                    Sync Calendar Streams
                </button>
            </div>
        </div>
    );
};

export default CalendarView;
