import { create } from "zustand";

export const useProductStore = create((set) => ({
    products: [],
    setProducts: (products) => set({ products }),
    
    createProduct: async (newProduct) => {

        if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.image) {
            return { success: false, message: "please provide full details of the product!" }
        }

        const res = await fetch("/api/products", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(newProduct),
        });

        if (!res.ok) {
            return { success: false, message: `Failed to create product. Status: ${res.status}` };
        }

        const data = await res.json();
        set((state) => ({ products: [...state.products, data.data] }));
        return { success: true, message: "Product Created successfully!" };
    },
    fetchProducts: async ()=>{
        const res = await fetch("/api/products");
        const data = await res.json();
        set({products: data.data});
    },
    deleteProducts: async(pid)=>{
        const res = await fetch(`api/products/${pid}`,{
            method:"DELETE",
        })
        const data = await res.json();
        if(!data.success) return {success:false, message:data.message};

        //this updates ui without need to refresh
        set(state =>({products: state.products.filter(product=>product._id != pid)}));
        return {success:true,message:data.message};
    },
    updateProducts : async(pid,updatedProduct)=>{
        const res= await fetch(`api/products/${pid}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(updatedProduct),
        });
        const data = await res.json();
        if(!data.success) return {success:false, message:"error while updating the details of product"};

        //update ui immediately wihtout refreshing the page
        set((state) =>({products: state.products.map((product)=>(product._id==pid ? data.data: product)),

        }));
        return {success:true, message:"Successfull Updated!"}
    }
}))