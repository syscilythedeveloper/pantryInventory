"use client"
import React, { useState, useEffect } from "react";
import { collection, addDoc, where, updateDoc, getDoc, getDocs, query, onSnapshot, deleteDoc, doc } from "firebase/firestore"; 
import { firestore } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "" });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Add item to db 
  const addItem = async (e) => {
    e.preventDefault();

    const trimmedName = newItem.name.trim();
    const newQuantity = parseFloat(newItem.quantity);

    if (trimmedName === "" || isNaN(newQuantity)) {
      return; // Ensure that the name and quantity are valid
    }
  
    const itemsCollection = collection(firestore, "items");
    const q = query(itemsCollection, where("name", "==", trimmedName));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Item already exists, update the quantity
      const existingDoc = querySnapshot.docs[0];
      const existingQuantity = parseFloat(existingDoc.data().quantity);
      await updateDoc(existingDoc.ref, {
        quantity: existingQuantity + newQuantity
      });
      console.log("Item quantity updated:", trimmedName);
    } else {
      // Item does not exist, add a new document
      await addDoc(itemsCollection, {
        name: trimmedName,
        quantity: newQuantity
      });
      console.log("New item added:", trimmedName);
    }

    // Clear the form
    setNewItem({ name: "", quantity: "" });
  };

  // Read items from db 
  useEffect(() => {
    const q = query(collection(firestore, "items"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Read total from itemsArr 
      const calcTotal = () => {
        const totalQuantity = itemsArr.reduce((sum, item) => sum + parseFloat(item.quantity), 0);
        setTotal(totalQuantity);
      };
      calcTotal();

      return () => unsubscribe();
    });
  }, []);

  // Filter items based on search query
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const increaseInventory = async (id) => {
    const docRef = doc(firestore, "items", id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const existingQuantity = parseFloat(docSnap.data().quantity);
      await updateDoc(docRef, {
        quantity: existingQuantity + 1
      });
      console.log("Item quantity updated for ID:", id);
    } else {
      console.log("No such document!");
    }
  };

  const decreaseInventory = async (id) => {
    const docRef = doc(firestore, "items", id);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const existingQuantity = parseFloat(docSnap.data().quantity);
      await updateDoc(docRef, {
        quantity: existingQuantity - 1
      });
      console.log("Item quantity updated for ID:", id);
      if (existingQuantity <= 0) {
        deleteItem(id);
      }
    } else {
      console.log("No such document!");
    }
  };

  const deleteItem = async (id) => {
    await deleteDoc(doc(firestore, "items", id));
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl p-4 text-center">Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="col-span-3 p-3 border" 
              type="text" 
              placeholder="Enter Item" 
            />
            <input 
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              value={newItem.quantity}
              className="col-span-2 p-3 border mx-3"
              type="number" 
              placeholder="Enter Quantity" 
            />
            <button 
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
              type="submit">
              +
            </button>
          </form>

          {/* Search Input Field */}
          <div className="flex items-center justify-center max-w-lg mx-auto">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-3 border"
              type="text"
              placeholder="Search Items"
            />
          </div>

          <ul>
            {filteredItems.map((item) => (
              <li key={item.id} className="text-white my-4 w-full items-center flex justify-between bg-slate-950">
                <div className="p-4 w-full flex justify-between">
                  <span className="capitalize">{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button onClick={() => increaseInventory(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">+</button>
                <button onClick={() => decreaseInventory(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">-</button>
              </li>
            ))}
          </ul>

          {items.length > 0 && (
            <div className="flex justify-between p-3">
              <span>Total</span>
              <span>{total}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
