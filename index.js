const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors'); // Import the cors middleware

const app = express()
app.use(express.json())
app.use(cors()); // Use cors middleware to allow all origins. Adjust options as needed.

const Conform = require('./conform.js')
const UserModel = require('./user.js')
const LoginModel = require('./login.js')
const ContactModel = require('./contactus.js')
// mongoose.connect("mongodb://localhost:27017/admin_database")
mongoose.connect("mongodb+srv://sanketbhimani92:sanketatlas9@cluster0.jh7pq.mongodb.net/admin_database?retryWrites=true&w=majority&appName=Cluster0")


// -----------for panding order---------------
app.get("/orderList", (req, res) => {
    UserModel.find({}).then(function (form_data) {
        if (form_data.length > 0) {
            res.json(form_data);
        } else {
            res.status(404).json({ message: "No orders found" });
        }
    }).catch(function (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/orderList/:id", async (req, res) => {
    const userData = await UserModel.findById(req.params.id);
    res.send(userData);
});

app.post("/BookNow", async (req, res) => {
    const userSchema = new UserModel({
        fullName: req.body.fullName,
        mobileNo: req.body.mobileNo,
        pincode: req.body.pincode,
        capacity: req.body.capacity,
        quantity: req.body.quantity,
        city: req.body.city,
        state: req.body.state,
        orderDate: req.body.orderDate,
        address: req.body.address,
    });
    await userSchema.save();
    res.send(userSchema);
});

app.delete("/orderList/:id", async (req, res) => {
    try {
        const deletedOrder = await UserModel.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
//-------------end panding order---------------

//------------for Conform order-----------------
app.get("/conformList", (req, res) => {
    Conform.find({}).then(function (conform_orders) {
        if (conform_orders.length > 0) {
            res.json(conform_orders);
        } else {
            res.status(404).json({ message: "No orders found" });
        }
    }).catch(function (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/conformList/:id", async (req, res) => {
    const conformData = await Conform.findById(req.params.id);
    res.send(conformData);
});

app.post("/addConform", async (req, res) => {
    try {
        const orderData = req.body;
        await UserModel.findByIdAndDelete(orderData._id);

        const conformSchema = new Conform({
            fullName: orderData.fullName,
            mobileNo: orderData.mobileNo,
            capacity: orderData.capacity,
            quantity: orderData.quantity,
            city: orderData.city,
            state: orderData.state,
            pincode: orderData.pincode,
            orderDate: orderData.orderDate,
            address: orderData.address,
        });
        await conformSchema.save();

        res.json({ message: "Order completed successfully" });
    } catch (error) {
        console.error("Error completing order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.delete("/addConform/:id", async (req, res) => {
    try {
        const deletedOrder = await Conform.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//--------------end conform order-----------------


//--------------start login----------------------

app.get("/login", (req, res) => {
    LoginModel.find({}).then(function (login_datas) {
        console.log(login_datas);
        if (login_datas.length > 0) {
            res.json(login_datas);
        } else {
            res.status(404).json({ message: "No orders found" });
        }
    }).catch(function (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

app.get("/login/:userName", async (req, res) => {
    try {
        const user = await LoginModel.findOne({ userName: req.params.userName });
        if (user) {
            res.status(200).json({ exists: true, user });
        } else {
            res.status(404).json({ exists: false, message: "Username not found." });
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

app.post("/forgot", async (req, res) => {
    // const LoginSchema = new LoginModel({
    //     userName: req.body.userName,
    //     password: req.body.password
    // });

    // await LoginSchema.save();
    // res.send(LoginSchema);
    if (req.body.userName && req.body.password) {
        let admin = await LoginModel.findOne(req.body)
        if (admin) {
            res.send({ admin, adminId: admin._id })
        } else {
            res.send({ msg: "Not found" })
        }
    }
});

app.patch("/login/:userName", async (req, res) => {
    try {
        const user = await LoginModel.findOne({ userName: req.params.userName });
        if (!user) {
            return res.status(404).send("User not found");
        }
        user.userName = req.body.userName;
        user.password = req.body.password;
        await user.save();
        res.send(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Error updating user");
    }
});


// app.delete("/")

//--------------end login------------------------


// --------------start contactus---------------
app.get("/messages", (req, res) => {
    ContactModel.find({}).then(function (messages) {
        if (messages.length > 0) {
            res.json(messages);
        } else {
            res.status(404).json({ message: "No orders found" });
        }
    }).catch(function (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/send-message", async (req, res) => {
    const { name, email, message } = req.body;
    try {
        const contactSchema = new ContactModel({
            name: name,
            email: email,
            message: message
        });
        const savedContact = await contactSchema.save();
        res.send(savedContact);
    } catch (error) {
        console.error("Error saving contact:", error);
        res.status(500).send("Error saving contact");
    }
});

app.delete("/messages/:id", async (req, res) => {
    try {
        const deletedOrder = await ContactModel.findByIdAndDelete(req.params.id);
        if (deletedOrder) {
            res.json({ message: "Order deleted successfully" });
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// -----------------end contactus------------------
app.listen(3030, () => {
    console.log("server is running...")
})