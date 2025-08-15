from .models import Category

PREDEFINED_CATEGORIES = [
    # Digital Goods
    {"name": "Digital Goods", "description": "Electronic and digital products like mobile phones and laptops"},
    {"name": "Mobile Phones", "description": "Smartphones from various brands", "parent": "Digital Goods"},
    {"name": "Laptops", "description": "Laptops for work, gaming, and education", "parent": "Digital Goods"},
    {"name": "Tablets", "description": "Android tablets and iPads", "parent": "Digital Goods"},
    {"name": "Smart Watches", "description": "Digital watches with smart features", "parent": "Digital Goods"},
    {"name": "Digital Accessories", "description": "Chargers, cables, earphones, and other accessories", "parent": "Digital Goods"},
    {"name": "Gaming Consoles", "description": "PlayStation, Xbox, Nintendo Switch", "parent": "Digital Goods"},
    {"name": "Computer Components", "description": "RAM, SSD, graphics cards", "parent": "Digital Goods"},

    # Home Appliances
    {"name": "Home Appliances", "description": "Essential household items like refrigerators and TVs"},
    {"name": "Refrigerators", "description": "Home and industrial refrigerators", "parent": "Home Appliances"},
    {"name": "Washing Machines", "description": "Automatic and semi-automatic washing machines", "parent": "Home Appliances"},
    {"name": "Televisions", "description": "LED, OLED, and smart TVs", "parent": "Home Appliances"},
    {"name": "Vacuum Cleaners", "description": "Standard and robotic vacuum cleaners", "parent": "Home Appliances"},
    {"name": "Microwaves", "description": "Microwave ovens and electric ovens", "parent": "Home Appliances"},
    {"name": "Air Conditioners", "description": "Split and window AC units", "parent": "Home Appliances"},
    {"name": "Kitchen Appliances", "description": "Blenders, toasters, coffee makers", "parent": "Home Appliances"},

    # Fashion & Clothing
    {"name": "Fashion & Clothing", "description": "Men's, women's, and children's clothing"},
    {"name": "Men's Clothing", "description": "Formal and casual men's wear", "parent": "Fashion & Clothing"},
    {"name": "Women's Clothing", "description": "Elegant and comfortable women's wear", "parent": "Fashion & Clothing"},
    {"name": "Kids' Clothing", "description": "Clothing for babies and children", "parent": "Fashion & Clothing"},
    {"name": "Bags & Shoes", "description": "Various bags and shoes for men and women", "parent": "Fashion & Clothing"},
    {"name": "Accessories", "description": "Watches, jewelry, sunglasses, and more", "parent": "Fashion & Clothing"},
    {"name": "Underwear & Sleepwear", "description": "Comfortable innerwear and pajamas", "parent": "Fashion & Clothing"},
    {"name": "Sportswear", "description": "Activewear for gym and outdoor activities", "parent": "Fashion & Clothing"},

    # Beauty & Health
    {"name": "Beauty & Health", "description": "Cosmetic, hygiene, and care products"},
    {"name": "Cosmetics", "description": "Makeup for face, eyes, and lips", "parent": "Beauty & Health"},
    {"name": "Hygiene", "description": "Personal and general hygiene products", "parent": "Beauty & Health"},
    {"name": "Skin Care", "description": "Creams, masks, and cleansers", "parent": "Beauty & Health"},
    {"name": "Hair Care", "description": "Shampoo, hair masks, dyes, and styling products", "parent": "Beauty & Health"},
    {"name": "Perfumes", "description": "Fragrances for men and women", "parent": "Beauty & Health"},
    {"name": "Oral Care", "description": "Toothpaste, mouthwash, dental floss", "parent": "Beauty & Health"},

    # Books & Stationery
    {"name": "Books & Stationery", "description": "Printed books and writing supplies"},
    {"name": "Books", "description": "Fiction, scientific, and educational books", "parent": "Books & Stationery"},
    {"name": "Notebooks & Pens", "description": "Notebooks, pens, pencils, and writing tools", "parent": "Books & Stationery"},
    {"name": "Art Supplies", "description": "Drawing, painting, and craft tools", "parent": "Books & Stationery"},
    {"name": "Office Supplies", "description": "Folders, staplers, calendars", "parent": "Books & Stationery"},
    {"name": "Educational Materials", "description": "Flashcards, workbooks, learning kits", "parent": "Books & Stationery"},

    # Automotive & Motorcycles
    {"name": "Automotive & Motorcycles", "description": "Vehicle parts and accessories"},
    {"name": "Spare Parts", "description": "Consumable and technical car parts", "parent": "Automotive & Motorcycles"},
    {"name": "Car Accessories", "description": "Covers, air fresheners, safety tools", "parent": "Automotive & Motorcycles"},
    {"name": "Motorcycles", "description": "Various motorcycles and related gear", "parent": "Automotive & Motorcycles"},
    {"name": "Tires", "description": "Car and motorcycle tires", "parent": "Automotive & Motorcycles"},
    {"name": "Engine Oils", "description": "Lubricants and fluids", "parent": "Automotive & Motorcycles"},
    {"name": "Car Electronics", "description": "GPS, dash cams, audio systems", "parent": "Automotive & Motorcycles"},

    # Sports & Travel
    {"name": "Sports & Travel", "description": "Sports and travel equipment"},
    {"name": "Sports Equipment", "description": "Gym, yoga, football, and other gear", "parent": "Sports & Travel"},
    {"name": "Camping & Travel", "description": "Tents, sleeping bags, flashlights", "parent": "Sports & Travel"},
    {"name": "Bicycles", "description": "City, mountain, and kids' bikes", "parent": "Sports & Travel"},
    {"name": "Luggage", "description": "Travel suitcases and backpacks", "parent": "Sports & Travel"},
    {"name": "Fitness Trackers", "description": "Smart bands and heart rate monitors", "parent": "Sports & Travel"},
    {"name": "Outdoor Clothing", "description": "Jackets, boots, thermal wear", "parent": "Sports & Travel"},

    # Toys & Baby
    {"name": "Toys & Baby", "description": "Products for babies and children"},
    {"name": "Educational Toys", "description": "Brain games and learning toys", "parent": "Toys & Baby"},
    {"name": "Baby Clothing", "description": "Clothes for infants and toddlers", "parent": "Toys & Baby"},
    {"name": "Baby Gear", "description": "Strollers, cribs, and newborn essentials", "parent": "Toys & Baby"},
    {"name": "Feeding Supplies", "description": "Bottles, sterilizers, baby food", "parent": "Toys & Baby"},
    {"name": "Diapers & Wipes", "description": "Disposable and cloth diapers", "parent": "Toys & Baby"},

    # Tools & Industrial Equipment
    {"name": "Tools & Industrial Equipment", "description": "Tools and construction materials"},
    {"name": "Hand Tools", "description": "Wrenches, screwdrivers, pliers", "parent": "Tools & Industrial Equipment"},
    {"name": "Power Tools", "description": "Drills, grinders, electric saws", "parent": "Tools & Industrial Equipment"},
    {"name": "Industrial Safety", "description": "Helmets, gloves, safety shoes", "parent": "Tools & Industrial Equipment"},
    {"name": "Building Materials", "description": "Cement, plaster, bricks, tiles", "parent": "Tools & Industrial Equipment"},
    {"name": "Electrical Equipment", "description": "Cables, switches, circuit breakers", "parent": "Tools & Industrial Equipment"},

    # Food & Beverages
    {"name": "Food & Beverages", "description": "Groceries and drinks"},
    {"name": "Groceries", "description": "Rice, oil, canned food, nuts", "parent": "Food & Beverages"},
    {"name": "Drinks", "description": "Juices, soda, herbal drinks", "parent": "Food & Beverages"},
    {"name": "Snacks", "description": "Chocolate, chips, puffs", "parent": "Food & Beverages"},

    # Digital Goods
    {"name": "Monitors", "description": "LED and gaming monitors", "parent": "Digital Goods"},
    {"name": "Printers & Scanners", "description": "Inkjet, laser printers and scanners", "parent": "Digital Goods"},
    {"name": "Networking Devices", "description": "Routers, modems, network switches", "parent": "Digital Goods"},

    # Home Appliances
    {"name": "Water Purifiers", "description": "Home water filtration systems", "parent": "Home Appliances"},
    {"name": "Heaters", "description": "Gas and electric heaters", "parent": "Home Appliances"},
    {"name": "Fans & Coolers", "description": "Ceiling fans, air coolers", "parent": "Home Appliances"},

    # Fashion & Clothing
    {"name": "Traditional Wear", "description": "Cultural and ethnic clothing", "parent": "Fashion & Clothing"},
    {"name": "Footwear", "description": "Sneakers, sandals, boots", "parent": "Fashion & Clothing"},
    {"name": "Jewelry", "description": "Necklaces, rings, bracelets", "parent": "Fashion & Clothing"},

    # Beauty & Health
    {"name": "Men's Grooming", "description": "Shaving kits, beard oils", "parent": "Beauty & Health"},
    {"name": "Women's Care", "description": "Feminine hygiene and care products", "parent": "Beauty & Health"},
    {"name": "Medical Supplies", "description": "Thermometers, masks, first aid kits", "parent": "Beauty & Health"},

    # Books & Stationery
    {"name": "Calendars & Planners", "description": "Yearly planners and wall calendars", "parent": "Books & Stationery"},
    {"name": "Craft Kits", "description": "DIY and hobby kits", "parent": "Books & Stationery"},
    {"name": "Children's Books", "description": "Storybooks and educational books for kids", "parent": "Books & Stationery"},

    # Automotive & Motorcycles
    {"name": "Motor Oils", "description": "Engine oils for cars and bikes", "parent": "Automotive & Motorcycles"},
    {"name": "Vehicle Lighting", "description": "Headlights, fog lamps, LED strips", "parent": "Automotive & Motorcycles"},
    {"name": "Motorcycle Helmets", "description": "Safety helmets for riders", "parent": "Automotive & Motorcycles"},

    # Sports & Travel
    {"name": "Water Sports", "description": "Swimming gear, goggles, snorkels", "parent": "Sports & Travel"},
    {"name": "Winter Sports", "description": "Skiing, snowboarding equipment", "parent": "Sports & Travel"},
    {"name": "Travel Accessories", "description": "Neck pillows, travel organizers", "parent": "Sports & Travel"},

    # Toys & Baby
    {"name": "Ride-on Toys", "description": "Toy cars, bikes for kids", "parent": "Toys & Baby"},
    {"name": "Bathing Essentials", "description": "Baby bathtubs, towels, soaps", "parent": "Toys & Baby"},
    {"name": "Baby Monitors", "description": "Audio and video baby monitoring devices", "parent": "Toys & Baby"},

    # Tools & Industrial Equipment
    {"name": "Welding Tools", "description": "Welding machines and accessories", "parent": "Tools & Industrial Equipment"},
    {"name": "Measuring Tools", "description": "Tape measures, laser levels", "parent": "Tools & Industrial Equipment"},
    {"name": "Plumbing Tools", "description": "Pipe cutters, wrenches, sealants", "parent": "Tools & Industrial Equipment"},

    # Food & Beverages
    {"name": "Dairy Products", "description": "Milk, cheese, yogurt", "parent": "Food & Beverages"},
    {"name": "Bakery", "description": "Bread, cakes, pastries", "parent": "Food & Beverages"},
    {"name": "Condiments & Spices", "description": "Salt, pepper, sauces, herbs", "parent": "Food & Beverages"},

]

def seed_static_categories():
    name_to_instance = {}

    for item in PREDEFINED_CATEGORIES:
        if 'parent' not in item:
            obj, _ = Category.objects.get_or_create(
                name=item['name'],
                defaults={'description': item.get('description', '')}
            )
            name_to_instance[item['name']] = obj

    for item in PREDEFINED_CATEGORIES:
        if 'parent' in item:
            parent_obj = name_to_instance.get(item['parent'])
            if parent_obj:
                obj, _ = Category.objects.get_or_create(
                    name=item['name'],
                    defaults={
                        'description': item.get('description', ''),
                        'parent': parent_obj
                    }
                )
                name_to_instance[item['name']] = obj
