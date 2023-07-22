const asyncHandler = require("express-async-handler"); //not need to use try catch block asyncHandler will handle it
const Contact = require("../models/contactModel"); // importing the schema from contactModel.js


// @description Get all contacts
//@route GET /api/contacts
// @access private
const getContacts = asyncHandler (async (req, res)=>{
    const contacts= await Contact.find({user_id: req.user._id});
    res.status(200).json(contacts);
});

// @description Create new contact
//@route POST /api/contacts
// @access private
const createContact = asyncHandler (async (req, res)=>{
    console.log(req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("Please fill all fields");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user._id,
    });
    res.status(201).json(contact);
});

// @description Get a specific contact
//@route GET /api/contacts:id
// @access private
const getContact = asyncHandler (async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }
    res.status(200).json(contact);
});

// @description Updating a contact contact
//@route PUT /api/contacts/:id
// @access private
const updateContact = asyncHandler (async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user._id){
        req.status(403);
        throw new Error("You are not authorized to update this contact");
    };

    const updateContact = await Contact.findByIdAndUpdate(req.params.id, req.body, {
        new: true
    });
    res.status(200).json(updateContact);
});

// @description Deleting a contact contact
//@route PUT /api/contacts/:id
// @access private
const deleteContact = asyncHandler (async (req, res)=>{
    const contact = await Contact.findById(req.params.id);
    if(!contact){
        res.status(404);
        throw new Error("Contact not found");
    }

    if(contact.user_id.toString() !== req.user._id){
        req.status(403);
        throw new Error("You are not authorized to update this contact");
    };

    await Contact.deleteOne({_id: req.params.id}); //.remove didn't work
    res.status(200).json(contact);
});

module.exports = {getContacts, createContact, getContact, updateContact, deleteContact};