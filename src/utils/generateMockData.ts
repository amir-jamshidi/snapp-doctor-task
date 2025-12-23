import type { IListItem } from "../types/share.types";

export const generateMockData = (count: number = 5000): IListItem[] => {
    return Array.from({ length: count }, (_, idx) => {
        return {
            id: idx,
            name: `${products[Math.floor(Math.random() * 50)]} | Product Number ${idx + 1}`,
            price: Math.round(Math.random() * 15000),
            category: categories[Math.floor(Math.random() * 20)],
            status: status[Math.floor(Math.random() * 2)]
        }
    })
}


const products = [
    "Smart Watch",
    "Wireless Headphones",
    "Bluetooth Speaker",
    "Laptop Stand",
    "Mechanical Keyboard",
    "Gaming Mouse",
    "USB-C Hub",
    "Portable Charger",
    "Power Bank",
    "Smartphone Holder",
    "Noise Cancelling Earbuds",
    "Fitness Tracker",
    "Action Camera",
    "Smart Home Hub",
    "LED Desk Lamp",
    "External Hard Drive",
    "SSD Drive",
    "Webcam HD",
    "Microphone Pro",
    "Streaming Camera",
    "VR Headset",
    "Gaming Chair",
    "Office Chair",
    "Standing Desk",
    "Ergonomic Mouse",
    "Wireless Charger",
    "Tablet Case",
    "Laptop Backpack",
    "Smart Light Bulb",
    "Security Camera",
    "Router AX",
    "WiFi Extender",
    "Air Purifier",
    "Electric Kettle",
    "Coffee Maker",
    "Blender Pro",
    "Kitchen Scale",
    "Smart Thermostat",
    "Robot Vacuum",
    "Hair Dryer",
    "Electric Toothbrush",
    "Shaving Machine",
    "Men Perfume",
    "Women Perfume",
    "Running Shoes",
    "Sneakers",
    "Backpack",
    "Sunglasses"
];

const categories = [
    "Technology",
    "Programming",
    "Web Development",
    "Graphic Design",
    "Business",
    "Marketing",
    "Education",
    "Health",
    "Fitness",
    "Lifestyle",
    "Travel",
    "Food",
    "Art",
    "Music",
    "Movies",
    "Books",
    "Gaming",
    "Science",
    "Finance",
    "Automotive"
];

const status: ["AVALIBALE", "NOT-AVALIBALE"] = ["AVALIBALE", "NOT-AVALIBALE"]
