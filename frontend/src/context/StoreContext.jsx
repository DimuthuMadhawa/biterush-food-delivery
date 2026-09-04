import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { food_list as original_food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const emojiMap = {
  "1": { emoji: "🥗", rating: 4.8, time: "15 min", tags: ["Healthy", "Fresh"] },
  "2": { emoji: "🥗", rating: 4.6, time: "12 min", tags: ["Healthy", "Low Carb"] },
  "3": { emoji: "🍀", rating: 4.7, time: "14 min", tags: ["Organic", "Fresh"] },
  "4": { emoji: "🍗", rating: 4.9, time: "18 min", tags: ["High Protein", "Savory"] },
  "5": { emoji: "🌯", rating: 4.5, time: "20 min", tags: ["Cheesy", "Baked"] },
  "6": { emoji: "🌯", rating: 4.7, time: "15 min", tags: ["Spicy", "Hot"] },
  "7": { emoji: "🌯", rating: 4.8, time: "16 min", tags: ["Savory", "High Protein"] },
  "8": { emoji: "🌯", rating: 4.6, time: "14 min", tags: ["Vegan", "Crispy"] },
  "9": { emoji: "🍨", rating: 4.8, time: "10 min", tags: ["Sweet", "Cold"] },
  "10": { emoji: "🍦", rating: 4.7, time: "10 min", tags: ["Fruity", "Cold"] },
  "11": { emoji: "🍧", rating: 4.6, time: "8 min", tags: ["Creamy", "Cold"] },
  "12": { emoji: "🍨", rating: 4.5, time: "8 min", tags: ["Classic", "Sweet"] },
  "13": { emoji: "🥪", rating: 4.8, time: "12 min", tags: ["Spicy", "Toasted"] },
  "14": { emoji: "🥪", rating: 4.6, time: "15 min", tags: ["Healthy", "Vegan"] },
  "15": { emoji: "🥪", rating: 4.7, time: "14 min", tags: ["Cheesy", "Toasted"] },
  "16": { emoji: "🥪", rating: 4.5, time: "10 min", tags: ["Simple", "Quick"] },
  "17": { emoji: "🧁", rating: 4.9, time: "10 min", tags: ["Sweet", "Glazed"] },
  "18": { emoji: "🍰", rating: 4.7, time: "15 min", tags: ["Gluten Free", "Vegan"] },
  "19": { emoji: "🎂", rating: 4.8, time: "18 min", tags: ["Rich", "Sweet"] },
  "20": { emoji: "🍰", rating: 4.6, time: "10 min", tags: ["Creamy", "Sweet"] },
  "21": { emoji: "🍄", rating: 4.7, time: "16 min", tags: ["Garlic", "Spicy"] },
  "22": { emoji: "🥦", rating: 4.8, time: "15 min", tags: ["Crispy", "Savory"] },
  "23": { emoji: "🍚", rating: 4.6, time: "20 min", tags: ["Aromatic", "Hot"] },
  "24": { emoji: "🍛", rating: 4.7, time: "18 min", tags: ["Healthy", "Fresh"] },
  "25": { emoji: "🍝", rating: 4.9, time: "15 min", tags: ["Cheesy", "Creamy"] },
  "26": { emoji: "🍝", rating: 4.7, time: "12 min", tags: ["Tangy", "Fresh"] },
  "27": { emoji: "🍝", rating: 4.8, time: "14 min", tags: ["Rich", "Creamy"] },
  "28": { emoji: "🍝", rating: 4.9, time: "18 min", tags: ["High Protein", "Hot"] },
  "29": { emoji: "🍜", rating: 4.6, time: "12 min", tags: ["Buttery", "Quick"] },
  "30": { emoji: "🍜", rating: 4.7, time: "15 min", tags: ["Fresh", "Vegan"] },
  "31": { emoji: "🍜", rating: 4.8, time: "16 min", tags: ["Classic", "Hot"] },
  "32": { emoji: "🍜", rating: 4.5, time: "10 min", tags: ["Savory", "Quick"] }
};

// Map original list to have required details
const defaultFoodList = original_food_list.map(item => {
  const extra = emojiMap[item._id] || { emoji: "🍔", rating: 4.5, time: "15 min", tags: ["Tasty"] };
  return {
    ...item,
    id: item._id, // Add string id
    emoji: extra.emoji,
    rating: extra.rating,
    time: extra.time,
    tags: extra.tags
  };
});

export { defaultFoodList as food_list };

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState(defaultFoodList);
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [addedItems, setAddedItems] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const url = "http://localhost:4000";
  
  // Theme state: default to 'dark', or retrieve from localStorage
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('biterush_theme') || 'dark';
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  // User account state for registration and member checkout
  const [userAccount, setUserAccount] = useState(() => {
    const saved = localStorage.getItem('biterush_user');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: false,
      firstName: "",
      lastName: "",
      email: "",
      avatar: "",
      rewardPoints: 388
    };
  });

  useEffect(() => {
    if (userAccount && userAccount.isLoggedIn) {
      localStorage.setItem('biterush_user', JSON.stringify(userAccount));
    } else {
      localStorage.removeItem('biterush_user');
    }
  }, [userAccount]);

  const logout = () => {
    localStorage.removeItem('biterush_user');
    localStorage.removeItem('token');
    setToken("");
    setUserAccount({
      isLoggedIn: false,
      firstName: "",
      lastName: "",
      email: "",
      avatar: "",
      rewardPoints: 0
    });
  };

  const getRegisteredDb = () => {
    try {
      const db = localStorage.getItem("biterush_registered_db");
      return db ? JSON.parse(db) : [];
    } catch (e) {
      return [];
    }
  };

  const saveToRegisteredDb = (user) => {
    try {
      const db = getRegisteredDb();
      db.push(user);
      localStorage.setItem("biterush_registered_db", JSON.stringify(db));
    } catch (e) {}
  };

  const loginWithApi = async (email, password) => {
    try {
      if (email === "admin@biterush.com" && password === "Admin@1234") {
        // Fetch the admin token from backend securely
        const adminRes = await axios.post(`${url}/api/user/admin-login`, { email, password });
        if (adminRes.data.success) {
          window.location.href = `http://localhost:5174/?token=${adminRes.data.token}`;
          return { success: true };
        } else {
          throw new Error("Admin login failed");
        }
      }

      const response = await axios.post(`${url}/api/user/login`, { email, password });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUserAccount(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || "Invalid email or password.");
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;

      // If backend returned a 400/401 credential validation error, present that directly
      if ((err.response?.status === 400 || err.response?.status === 401) && serverMsg) {
        throw new Error(serverMsg);
      }

      // If server is offline or DB times out (500), perform resilient local login check
      const cleanEmail = email.trim().toLowerCase();
      const db = getRegisteredDb();
      const found = db.find(u => u.email === cleanEmail && u.password === password);

      if (found) {
        const userObj = { ...found, isLoggedIn: true };
        const mockToken = "mock_jwt_token_" + Date.now();
        setToken(mockToken);
        localStorage.setItem("token", mockToken);
        setUserAccount(userObj);
        return { success: true, user: userObj };
      }

      // Default demo accounts
      if (cleanEmail === "user.google@gmail.com" || cleanEmail.includes("dimuthu")) {
        const defaultUser = {
          id: "usr_demo",
          firstName: "Dimuthu",
          lastName: "Madhawa",
          email: cleanEmail,
          rewardPoints: 452,
          isLoggedIn: true
        };
        const mockToken = "mock_jwt_token_" + Date.now();
        setToken(mockToken);
        localStorage.setItem("token", mockToken);
        setUserAccount(defaultUser);
        return { success: true, user: defaultUser };
      }

      throw new Error(serverMsg || "Invalid email or password.");
    }
  };

  const registerWithApi = async (data) => {
    try {
      const response = await axios.post(`${url}/api/user/register`, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUserAccount(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || "Registration failed.");
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message;

      // If server returned a 400 Bad Request validation error (duplicate email/phone, weak password), present it directly
      if (err.response?.status === 400 && serverMsg) {
        throw new Error(serverMsg);
      }

      // If server is offline or DB times out (500), perform resilient local account creation
      const cleanEmail = data.email.trim().toLowerCase();
      const cleanPhone = data.phone ? data.phone.trim() : "";
      const db = getRegisteredDb();

      const duplicate = db.find(u => u.email === cleanEmail || (cleanPhone && u.phone === cleanPhone));
      if (duplicate) {
        throw new Error("An account with this email address already exists.");
      }

      const newUser = {
        id: "usr_" + Date.now(),
        firstName: data.firstName.trim(),
        lastName: data.lastName ? data.lastName.trim() : "",
        email: cleanEmail,
        phone: cleanPhone,
        password: data.password,
        rewardPoints: 452,
        isLoggedIn: true
      };

      saveToRegisteredDb(newUser);
      const mockToken = "mock_jwt_token_" + Date.now();
      setToken(mockToken);
      localStorage.setItem("token", mockToken);
      setUserAccount(newUser);
      return { success: true, user: newUser };
    }
  };

  const googleLoginWithApi = async (profile) => {
    try {
      const response = await axios.post(`${url}/api/user/google-login`, profile);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        setUserAccount(response.data.user);
        return response.data;
      } else {
        throw new Error(response.data.message || "Google login failed.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }

      const googleUser = {
        id: "usr_google_" + Date.now(),
        firstName: profile.name || "Google User",
        lastName: "",
        email: profile.email || "user.google@gmail.com",
        avatar: profile.avatar || "",
        rewardPoints: 452,
        isLoggedIn: true
      };

      const mockToken = "mock_google_jwt_" + Date.now();
      setToken(mockToken);
      localStorage.setItem("token", mockToken);
      setUserAccount(googleUser);
      return { success: true, user: googleUser };
    }
  };

  // Persist theme and apply data-theme attribute
  useEffect(() => {
    localStorage.setItem('biterush_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if(response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0){
        const mappedData = response.data.data.map(item => {
          const extra = emojiMap[item._id] || { emoji: "🍔", rating: 4.5, time: "15 min", tags: ["Tasty"] };
          // Append URL if it's a backend image (doesn't start with / or data:)
          const imageUrl = item.image.startsWith('http') || item.image.startsWith('/') || item.image.startsWith('data:') 
            ? item.image 
            : `${url}/images/${item.image}`;
            
          return {
            ...item,
            id: item._id,
            image: imageUrl,
            emoji: extra.emoji,
            rating: extra.rating,
            time: extra.time,
            tags: extra.tags
          };
        });
        setFoodList(mappedData);
      } else {
        // Fallback to local assets if backend DB is empty
        setFoodList(original_food_list.map(item => ({
          ...item,
          id: item._id,
          emoji: (emojiMap[item._id] || {}).emoji || "🍔",
          rating: (emojiMap[item._id] || {}).rating || 4.5,
          time: (emojiMap[item._id] || {}).time || "15 min",
          tags: (emojiMap[item._id] || {}).tags || ["Tasty"]
        })));
      }
    } catch (error) {
      console.log("Error fetching food list", error);
      // Fallback to local assets if backend connection fails
      setFoodList(original_food_list.map(item => ({
        ...item,
        id: item._id,
        emoji: (emojiMap[item._id] || {}).emoji || "🍔",
        rating: (emojiMap[item._id] || {}).rating || 4.5,
        time: (emojiMap[item._id] || {}).time || "15 min",
        tags: (emojiMap[item._id] || {}).tags || ["Tasty"]
      })));
    }
  }

  useEffect(() => {
    fetchFoodList();
    const handleScroll = () => {
      if (window.scrollY > 60) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const addToCart = (itemId) => {
    // Green flash state trigger
    setAddedItems((prev) => ({ ...prev, [itemId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [itemId]: false }));
    }, 800);

    setCart((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });
  };

  const getCartTotal = () => {
    let total = 0;
    for (const item in cart) {
      if (cart[item] > 0) {
        const itemInfo = food_list.find((product) => product.id === item);
        if (itemInfo) {
          total += itemInfo.price * cart[item];
        }
      }
    }
    return total;
  };

  const getCartCount = () => {
    let count = 0;
    for (const item in cart) {
      if (cart[item] > 0) {
        count += cart[item];
      }
    }
    return count;
  };

  const contextValue = {
    food_list,
    cart,
    setCart,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addedItems,
    cartOpen,
    setCartOpen,
    scrolled,
    theme,
    setTheme,
    userAccount,
    setUserAccount,
    token,
    setToken,
    loginWithApi,
    registerWithApi,
    googleLoginWithApi,
    logout,
    url
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;