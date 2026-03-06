import z from "zod";

export const AddressZod = z.object({
    fullName: z.string().max(50, { message: "Name cannot exceed 50 characters" }).regex(/^[A-Za-z\s]+$/, { message: "Name must contain only letters" }),
    Country: z.literal("India"),
    AddressLine1:  z.string().min(3,{ message: "Address should be atleast 3 charaters long"}).max(250, { message: "Address cannot exceed 250 characters" }),
    AddressLine2:  z.string().max(250, { message: "Address cannot exceed 250 characters" }).optional(),
    City: z.string().min(3,{ message: "City should be atleast 3 charaters long"}).max(50, { message: "City cannot exceed 50 characters" }),
    State: z.string().min(3,{ message: "City should be atleast 3 charaters long"}).max(50, { message: "City cannot exceed 50 characters" }),
    pincode: z.string().min(6,{message : "Invalid Pin Code"}).max(6, { message: "Invalid Pin Code" }).regex(/^[0-9]{6}$/, { message: "Invalid pin code" }),
    PhoneNumber: z.string().min(10,{message : "Invalid phone number"}).max(10, { message: "Invalid phone number" }).regex(/^[0-9]{10}$/, { message: "Invalid phone number" }),
})