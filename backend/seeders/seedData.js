/**
 * Default content and sample data for all 10 templates.
 * Used by cloneTemplate to seed initial content for each tenant.
 */

module.exports = {
    // ============================================
    // INFORMATIONAL TEMPLATES (5)
    // ============================================

    portfolio: {
        content: [
            { page: 'home', section: 'hero', data: { title: 'John Doe', subtitle: 'Full Stack Developer & Designer', description: 'I craft beautiful digital experiences with clean code and creative design.', cta: 'View My Work', ctaLink: '/projects' }, order: 0 },
            { page: 'home', section: 'skills', data: { title: 'My Skills', items: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Figma', 'AWS'] }, order: 1 },
            { page: 'home', section: 'featured_projects', data: { title: 'Featured Work', items: [{ name: 'E-Commerce Platform', description: 'Full-stack shopping experience', tech: 'React, Node.js, Stripe' }, { name: 'Task Manager Pro', description: 'Collaborative project management tool', tech: 'Next.js, PostgreSQL' }, { name: 'Weather Dashboard', description: 'Real-time weather visualization', tech: 'React, OpenWeather API' }] }, order: 2 },
            { page: 'about', section: 'hero', data: { title: 'About Me', description: 'I am a passionate full-stack developer with 5+ years of experience building web applications. I love turning ideas into reality through elegant code.' }, order: 0 },
            { page: 'about', section: 'experience', data: { title: 'Experience', items: [{ company: 'TechCorp', role: 'Senior Developer', duration: '2022 - Present' }, { company: 'StartupXYZ', role: 'Full Stack Developer', duration: '2020 - 2022' }, { company: 'WebAgency', role: 'Junior Developer', duration: '2018 - 2020' }] }, order: 1 },
            { page: 'projects', section: 'hero', data: { title: 'My Projects', description: 'A collection of my best work across web development and design.' }, order: 0 },
            { page: 'projects', section: 'list', data: { items: [{ name: 'E-Commerce Platform', description: 'Full-stack shopping experience with payment integration', tech: 'React, Node.js, Stripe', link: '#' }, { name: 'Task Manager Pro', description: 'Collaborative project management tool with real-time updates', tech: 'Next.js, PostgreSQL, Socket.io', link: '#' }, { name: 'Weather Dashboard', description: 'Real-time weather visualization with interactive maps', tech: 'React, OpenWeather API, Mapbox', link: '#' }, { name: 'Social Media App', description: 'Full-featured social platform with messaging', tech: 'React Native, Firebase', link: '#' }] }, order: 1 },
            { page: 'contact', section: 'hero', data: { title: 'Get In Touch', description: 'Have a project in mind? Let\'s work together to bring your ideas to life.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'john@example.com', phone: '+1 234 567 8900', location: 'San Francisco, CA' }, order: 1 }
        ]
    },

    resume: {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Jane Smith', subtitle: 'Software Engineer', description: 'Building scalable solutions with modern technologies. Open to new opportunities.', cta: 'Download Resume', ctaLink: '#' }, order: 0 },
            { page: 'home', section: 'summary', data: { title: 'Professional Summary', description: 'Results-driven software engineer with 6 years of experience in designing and implementing scalable web applications. Expertise in JavaScript, Python, and cloud technologies.' }, order: 1 },
            { page: 'experience', section: 'hero', data: { title: 'Work Experience' }, order: 0 },
            { page: 'experience', section: 'list', data: { items: [{ company: 'Google', role: 'Software Engineer', duration: '2022 - Present', highlights: ['Led migration of legacy services to microservices architecture', 'Improved API performance by 40%'] }, { company: 'Amazon', role: 'SDE II', duration: '2020 - 2022', highlights: ['Built internal tools serving 10k+ employees', 'Mentored 3 junior developers'] }, { company: 'Startup Inc', role: 'Full Stack Developer', duration: '2018 - 2020', highlights: ['Developed MVP from scratch', 'Grew user base to 50k+'] }] }, order: 1 },
            { page: 'skills', section: 'hero', data: { title: 'Skills & Technologies' }, order: 0 },
            { page: 'skills', section: 'list', data: { categories: [{ name: 'Frontend', items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'] }, { name: 'Backend', items: ['Node.js', 'Python', 'Go', 'PostgreSQL'] }, { name: 'DevOps', items: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] }] }, order: 1 },
            { page: 'contact', section: 'hero', data: { title: 'Contact Me', description: 'Open for opportunities. Let\'s connect!' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'jane@example.com', linkedin: 'linkedin.com/in/janesmith', github: 'github.com/janesmith' }, order: 1 }
        ]
    },

    agency: {
        content: [
            { page: 'home', section: 'hero', data: { title: 'We Build Digital Experiences', subtitle: 'Creative Agency', description: 'We are a team of designers, developers, and strategists who create extraordinary digital products.', cta: 'Our Work', ctaLink: '/projects' }, order: 0 },
            { page: 'home', section: 'stats', data: { items: [{ label: 'Projects Completed', value: '150+' }, { label: 'Happy Clients', value: '80+' }, { label: 'Team Members', value: '25' }, { label: 'Years Experience', value: '8+' }] }, order: 1 },
            { page: 'home', section: 'services_preview', data: { title: 'What We Do', items: [{ name: 'Web Development', description: 'Custom websites and web applications built with modern technologies.' }, { name: 'UI/UX Design', description: 'User-centered designs that drive engagement and conversions.' }, { name: 'Brand Strategy', description: 'Strategic branding that tells your story and connects with your audience.' }] }, order: 2 },
            { page: 'about', section: 'hero', data: { title: 'About Our Agency', description: 'Founded in 2016, we have been helping businesses transform their digital presence. Our team combines creativity with technical expertise to deliver exceptional results.' }, order: 0 },
            { page: 'about', section: 'team', data: { title: 'Our Team', items: [{ name: 'Alex Johnson', role: 'CEO & Founder', bio: '10+ years in digital strategy' }, { name: 'Sarah Williams', role: 'Lead Designer', bio: 'Award-winning UI/UX designer' }, { name: 'Mike Chen', role: 'Tech Lead', bio: 'Full-stack architect' }] }, order: 1 },
            { page: 'services', section: 'hero', data: { title: 'Our Services', description: 'Comprehensive digital solutions tailored to your business needs.' }, order: 0 },
            { page: 'services', section: 'list', data: { items: [{ name: 'Web Development', description: 'Custom websites, SPAs, and progressive web apps using React, Next.js, and Node.js.', price: 'From $5,000' }, { name: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android.', price: 'From $10,000' }, { name: 'UI/UX Design', description: 'Research-driven design with wireframes, prototypes, and design systems.', price: 'From $3,000' }, { name: 'Brand Identity', description: 'Logo design, brand guidelines, and visual identity packages.', price: 'From $2,000' }] }, order: 1 },
            { page: 'projects', section: 'hero', data: { title: 'Our Portfolio', description: 'Selected projects that showcase our expertise.' }, order: 0 },
            { page: 'projects', section: 'list', data: { items: [{ name: 'FinTech Dashboard', description: 'Trading platform with real-time data visualization', category: 'Web App' }, { name: 'E-Learning Platform', description: 'Online learning system with video courses', category: 'Web App' }, { name: 'Healthcare App', description: 'Patient management mobile application', category: 'Mobile' }] }, order: 1 },
            { page: 'contact', section: 'hero', data: { title: 'Let\'s Work Together', description: 'Ready to start your project? Get in touch with us.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'hello@agency.com', phone: '+1 555 123 4567', address: '123 Creative Street, NY 10001' }, order: 1 }
        ]
    },

    'startup-landing': {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Launch Your Product Faster', subtitle: 'SaaS Solution', description: 'The all-in-one platform that helps startups build, deploy, and scale their products with ease.', cta: 'Get Started Free', ctaLink: '/contact' }, order: 0 },
            { page: 'home', section: 'logos', data: { title: 'Trusted by leading companies', items: ['TechCorp', 'InnovateLab', 'DataFlow', 'CloudBase', 'ScaleUp'] }, order: 1 },
            { page: 'features', section: 'hero', data: { title: 'Powerful Features', description: 'Everything you need to build and grow your startup.' }, order: 0 },
            { page: 'features', section: 'list', data: { items: [{ name: 'Analytics Dashboard', description: 'Real-time insights into your product performance and user behavior.', icon: 'BarChart3' }, { name: 'Team Collaboration', description: 'Work together seamlessly with built-in communication tools.', icon: 'Users' }, { name: 'Automated Workflows', description: 'Save time with intelligent automation for repetitive tasks.', icon: 'Zap' }, { name: 'API Integration', description: 'Connect with 100+ popular tools and services.', icon: 'Link' }, { name: 'Security First', description: 'Enterprise-grade security with SOC 2 compliance.', icon: 'Shield' }, { name: '24/7 Support', description: 'Get help whenever you need it from our expert team.', icon: 'Headphones' }] }, order: 1 },
            { page: 'pricing', section: 'hero', data: { title: 'Simple, Transparent Pricing', description: 'Choose the plan that fits your needs. No hidden fees.' }, order: 0 },
            { page: 'pricing', section: 'plans', data: { items: [{ name: 'Starter', price: 'Free', period: 'forever', features: ['Up to 3 projects', 'Basic analytics', 'Community support', '1GB storage'], cta: 'Get Started' }, { name: 'Pro', price: '$29', period: '/month', features: ['Unlimited projects', 'Advanced analytics', 'Priority support', '50GB storage', 'Custom domain'], cta: 'Start Free Trial', popular: true }, { name: 'Enterprise', price: '$99', period: '/month', features: ['Everything in Pro', 'SSO & SAML', 'Dedicated support', 'Unlimited storage', 'SLA guarantee'], cta: 'Contact Sales' }] }, order: 1 },
            { page: 'faq', section: 'hero', data: { title: 'Frequently Asked Questions', description: 'Got questions? We have answers.' }, order: 0 },
            { page: 'faq', section: 'list', data: { items: [{ question: 'How do I get started?', answer: 'Sign up for a free account and follow our quick-start guide.' }, { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no penalties.' }, { question: 'Do you offer refunds?', answer: 'We offer a 30-day money-back guarantee on all paid plans.' }, { question: 'Is my data secure?', answer: 'Yes, we use industry-standard encryption and security practices.' }] }, order: 1 },
            { page: 'contact', section: 'hero', data: { title: 'Get In Touch', description: 'Have questions? Our team is here to help.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'hello@startup.com', phone: '+1 800 123 4567' }, order: 1 }
        ]
    },

    'product-showcase': {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Introducing ProductX', subtitle: 'The Future of Work', description: 'A revolutionary tool that transforms how teams collaborate, communicate, and create together.', cta: 'Learn More', ctaLink: '/features' }, order: 0 },
            { page: 'home', section: 'highlights', data: { title: 'Why Choose Us', items: [{ name: 'Lightning Fast', description: 'Built for speed with sub-100ms response times.' }, { name: 'Beautiful Design', description: 'Crafted with attention to every pixel.' }, { name: 'Enterprise Ready', description: 'Scales from startup to enterprise.' }] }, order: 1 },
            { page: 'features', section: 'hero', data: { title: 'Product Features', description: 'Discover what makes our product stand out.' }, order: 0 },
            { page: 'features', section: 'list', data: { items: [{ name: 'Real-time Sync', description: 'Changes sync across all devices instantly.', icon: 'RefreshCw' }, { name: 'Smart Search', description: 'AI-powered search finds what you need in seconds.', icon: 'Search' }, { name: 'Integrations', description: 'Connect with your favorite tools seamlessly.', icon: 'Link' }, { name: 'Mobile App', description: 'Full-featured mobile experience on iOS and Android.', icon: 'Smartphone' }] }, order: 1 },
            { page: 'gallery', section: 'hero', data: { title: 'Product Gallery', description: 'See our product in action.' }, order: 0 },
            { page: 'gallery', section: 'images', data: { items: [{ title: 'Dashboard View', description: 'Clean, intuitive dashboard' }, { title: 'Analytics', description: 'Powerful data visualization' }, { title: 'Mobile App', description: 'On-the-go access' }, { title: 'Team View', description: 'Collaborative workspace' }] }, order: 1 },
            { page: 'contact', section: 'hero', data: { title: 'Request a Demo', description: 'See how our product can help your team.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'demo@product.com', phone: '+1 888 555 0123' }, order: 1 }
        ]
    },

    // ============================================
    // FUNCTIONAL TEMPLATES (5)
    // ============================================

    restaurant: {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Welcome to Bella Cucina', subtitle: 'Authentic Italian Restaurant', description: 'Experience the finest Italian cuisine prepared with fresh, locally-sourced ingredients.', cta: 'View Menu', ctaLink: '/menu' }, order: 0 },
            { page: 'home', section: 'highlights', data: { title: 'Why Dine With Us', items: [{ name: 'Fresh Ingredients', description: 'Locally sourced, farm-to-table ingredients daily.' }, { name: 'Master Chef', description: '20 years of culinary excellence.' }, { name: 'Cozy Ambiance', description: 'Perfect setting for any occasion.' }] }, order: 1 },
            { page: 'home', section: 'hours', data: { title: 'Opening Hours', items: [{ day: 'Mon - Fri', hours: '11:00 AM - 10:00 PM' }, { day: 'Saturday', hours: '10:00 AM - 11:00 PM' }, { day: 'Sunday', hours: '10:00 AM - 9:00 PM' }] }, order: 2 },
            { page: 'menu', section: 'hero', data: { title: 'Our Menu', description: 'Explore our carefully crafted dishes.' }, order: 0 },
            { page: 'contact', section: 'hero', data: { title: 'Contact & Location', description: 'Visit us or place an order.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'info@bellacucina.com', phone: '+1 555 987 6543', address: '456 Food Street, NY 10002' }, order: 1 }
        ],
        products: [
            { name: 'Margherita Pizza', description: 'Fresh mozzarella, basil, and San Marzano tomato sauce on hand-tossed dough.', price: 14.99, category: 'Pizza', isAvailable: true, order: 0 },
            { name: 'Pepperoni Pizza', description: 'Classic pepperoni with melted mozzarella and our signature sauce.', price: 16.99, category: 'Pizza', isAvailable: true, order: 1 },
            { name: 'Spaghetti Carbonara', description: 'Classic Roman pasta with pancetta, egg, and Pecorino Romano.', price: 18.99, category: 'Pasta', isAvailable: true, order: 2 },
            { name: 'Fettuccine Alfredo', description: 'Rich and creamy Alfredo sauce with freshly made fettuccine.', price: 17.99, category: 'Pasta', isAvailable: true, order: 3 },
            { name: 'Caesar Salad', description: 'Crisp romaine lettuce with our homemade Caesar dressing and croutons.', price: 11.99, category: 'Salads', isAvailable: true, order: 4 },
            { name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.', price: 9.99, category: 'Desserts', isAvailable: true, order: 5 },
            { name: 'Bruschetta', description: 'Toasted bread topped with fresh tomatoes, garlic, and basil.', price: 8.99, category: 'Appetizers', isAvailable: true, order: 6 }
        ]
    },

    'car-booking': {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Premium Car Rentals', subtitle: 'Drive Your Dream', description: 'Choose from our wide selection of vehicles. Affordable rates, easy booking, and 24/7 support.', cta: 'Browse Cars', ctaLink: '/cars' }, order: 0 },
            { page: 'home', section: 'highlights', data: { title: 'Why Choose Us', items: [{ name: 'Wide Selection', description: '50+ vehicles from economy to luxury.' }, { name: 'Best Prices', description: 'Competitive rates with no hidden fees.' }, { name: 'Free Cancellation', description: 'Cancel up to 24 hours before pickup.' }] }, order: 1 },
            { page: 'cars', section: 'hero', data: { title: 'Our Fleet', description: 'Browse our collection of well-maintained vehicles.' }, order: 0 },
            { page: 'booking', section: 'hero', data: { title: 'Book Your Ride', description: 'Fill in the details to reserve your vehicle.' }, order: 0 },
            { page: 'contact', section: 'hero', data: { title: 'Contact Us', description: 'Need help? We\'re here for you 24/7.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'rent@carbooking.com', phone: '+1 555 222 3333', address: '789 Auto Drive, LA 90001' }, order: 1 }
        ],
        products: [
            { name: 'Toyota Camry', description: 'Comfortable sedan perfect for city driving and long trips.', price: 45, category: 'Sedan', isAvailable: true, order: 0 },
            { name: 'Honda CR-V', description: 'Versatile SUV with plenty of space for family adventures.', price: 65, category: 'SUV', isAvailable: true, order: 1 },
            { name: 'BMW 3 Series', description: 'Luxury sedan with premium features and sporty performance.', price: 95, category: 'Luxury', isAvailable: true, order: 2 },
            { name: 'Ford Mustang', description: 'Iconic sports car for an unforgettable driving experience.', price: 120, category: 'Sports', isAvailable: true, order: 3 },
            { name: 'Toyota Corolla', description: 'Reliable and fuel-efficient economy car.', price: 35, category: 'Economy', isAvailable: true, order: 4 },
            { name: 'Mercedes-Benz E-Class', description: 'Elegant luxury vehicle with cutting-edge technology.', price: 130, category: 'Luxury', isAvailable: true, order: 5 }
        ]
    },

    'service-booking': {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Book Your Service', subtitle: 'Professional Services', description: 'Quality services at your convenience. Book online and let our experts take care of the rest.', cta: 'View Services', ctaLink: '/services' }, order: 0 },
            { page: 'home', section: 'highlights', data: { title: 'Why Us', items: [{ name: 'Expert Professionals', description: 'Vetted and experienced service providers.' }, { name: 'Easy Booking', description: 'Book in seconds, choose your time slot.' }, { name: 'Satisfaction Guaranteed', description: 'Not satisfied? We\'ll make it right.' }] }, order: 1 },
            { page: 'services', section: 'hero', data: { title: 'Our Services', description: 'Explore our range of professional services.' }, order: 0 },
            { page: 'book', section: 'hero', data: { title: 'Book an Appointment', description: 'Choose a service and select your preferred date and time.' }, order: 0 },
            { page: 'contact', section: 'hero', data: { title: 'Contact Us', description: 'Questions? We\'d love to hear from you.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'support@servicebook.com', phone: '+1 555 444 5555', address: '321 Service Ave, Chicago 60601' }, order: 1 }
        ],
        services: [
            { name: 'Haircut & Styling', description: 'Professional haircut and styling by our expert stylists.', duration: '45 min', price: 35, category: 'Hair', isAvailable: true, order: 0 },
            { name: 'Hair Coloring', description: 'Full color, highlights, or balayage treatments.', duration: '120 min', price: 85, category: 'Hair', isAvailable: true, order: 1 },
            { name: 'Facial Treatment', description: 'Rejuvenating facial with deep cleansing and hydration.', duration: '60 min', price: 55, category: 'Skin Care', isAvailable: true, order: 2 },
            { name: 'Manicure & Pedicure', description: 'Complete nail care with polish or gel application.', duration: '60 min', price: 45, category: 'Nails', isAvailable: true, order: 3 },
            { name: 'Deep Tissue Massage', description: 'Therapeutic massage targeting deep muscle tension.', duration: '60 min', price: 75, category: 'Massage', isAvailable: true, order: 4 },
            { name: 'Bridal Package', description: 'Complete bridal beauty package including hair, makeup, and nails.', duration: '180 min', price: 250, category: 'Special', isAvailable: true, order: 5 }
        ]
    },

    'event-management': {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Upcoming Events', subtitle: 'Discover & Register', description: 'Find and register for exciting events happening near you. Conferences, workshops, meetups, and more.', cta: 'Browse Events', ctaLink: '/events' }, order: 0 },
            { page: 'home', section: 'highlights', data: { title: 'What We Offer', items: [{ name: 'Diverse Events', description: 'From tech meetups to creative workshops.' }, { name: 'Easy Registration', description: 'Register in one click, get instant confirmation.' }, { name: 'Networking', description: 'Connect with like-minded professionals.' }] }, order: 1 },
            { page: 'events', section: 'hero', data: { title: 'All Events', description: 'Browse our complete event calendar.' }, order: 0 },
            { page: 'register', section: 'hero', data: { title: 'Register for Event', description: 'Fill in your details to secure your spot.' }, order: 0 },
            { page: 'contact', section: 'hero', data: { title: 'Contact Us', description: 'Want to host an event? Let\'s talk.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'events@eventmgmt.com', phone: '+1 555 666 7777', address: '555 Event Plaza, SF 94102' }, order: 1 }
        ],
        events: [
            { title: 'Tech Innovation Summit 2026', description: 'Join industry leaders for a day of talks on AI, Web3, and the future of tech. Networking lunch included.', date: new Date('2026-04-15'), venue: 'Convention Center, Hall A', capacity: 200, image: '', category: 'Conference', isActive: true },
            { title: 'React Developers Meetup', description: 'Monthly meetup for React enthusiasts. This month: Server Components deep dive.', date: new Date('2026-03-20'), venue: 'Cowork Hub, Room 3B', capacity: 50, image: '', category: 'Meetup', isActive: true },
            { title: 'UI/UX Design Workshop', description: 'Hands-on workshop on modern design practices. Bring your laptop!', date: new Date('2026-04-05'), venue: 'Design Lab', capacity: 30, image: '', category: 'Workshop', isActive: true },
            { title: 'Startup Pitch Night', description: 'Watch startups pitch to investors. Free food and drinks!', date: new Date('2026-04-25'), venue: 'Innovation Hub', capacity: 150, image: '', category: 'Networking', isActive: true }
        ]
    },

    marketplace: {
        content: [
            { page: 'home', section: 'hero', data: { title: 'Shop the Best Products', subtitle: 'Online Marketplace', description: 'Discover curated products from trusted sellers. Quality guaranteed, fast delivery.', cta: 'Shop Now', ctaLink: '/products' }, order: 0 },
            { page: 'home', section: 'categories', data: { title: 'Shop by Category', items: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'] }, order: 1 },
            { page: 'products', section: 'hero', data: { title: 'All Products', description: 'Browse our complete catalog.' }, order: 0 },
            { page: 'contact', section: 'hero', data: { title: 'Customer Support', description: 'Need help? Our team is available 24/7.' }, order: 0 },
            { page: 'contact', section: 'info', data: { email: 'support@marketplace.com', phone: '+1 555 888 9999' }, order: 1 }
        ],
        products: [
            { name: 'Wireless Bluetooth Headphones', description: 'Premium noise-cancelling headphones with 30-hour battery life.', price: 79.99, category: 'Electronics', isAvailable: true, order: 0 },
            { name: 'Smart Watch Pro', description: 'Feature-rich smartwatch with health tracking and GPS.', price: 199.99, category: 'Electronics', isAvailable: true, order: 1 },
            { name: 'Organic Cotton T-Shirt', description: 'Comfortable, sustainable t-shirt in multiple colors.', price: 29.99, category: 'Clothing', isAvailable: true, order: 2 },
            { name: 'Portable Bluetooth Speaker', description: 'Waterproof speaker with 360-degree sound.', price: 49.99, category: 'Electronics', isAvailable: true, order: 3 },
            { name: 'Yoga Mat Premium', description: 'Extra thick, non-slip yoga mat for all practices.', price: 39.99, category: 'Sports', isAvailable: true, order: 4 },
            { name: 'LED Desk Lamp', description: 'Adjustable LED lamp with wireless charging base.', price: 54.99, category: 'Home & Garden', isAvailable: true, order: 5 }
        ]
    }
};
