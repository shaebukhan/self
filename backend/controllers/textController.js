const PostModel = require("../models/PostModel");
const fs = require("fs");
const PostController = async (req, res) => {
    try {
        // console.log(req);
        const { title, description, user_id } = req.body;
        const image = req.file.filename; // Access the uploaded image using req.file

        console.log(title, description, user_id, image);

        if (!title || !description || !image || !user_id) {
            return res.status(403).send({
                success: false,
                message: "All Fields are Required !!"
            });
        }

        const post = await PostModel.create({ title, description, image, user: user_id });
        return res.status(201).send({
            success: true,
            message: "Post has been Added and will appear soon !!",
            post
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};
const PostsController = async (req, res) => {
    try {

        const posts = await PostModel.find({});
        if (!posts) {
            return res.status(404).send({
                success: false,
                message: "No Posts Available"
            });
        }
        return res.status(201).send({
            success: true,
            message: "Posts are Available !!",
            posts
        });
    } catch (error) {
        console.error(error); // Log any errors
        return res.status(500).send({ // Return a 500 status code for internal server error
            success: false,
            message: "Internal server error"
        });
    }
};

const UpdatePostController = async (req, res) => {
    try {
        const { _id, title, description, user_id } = req.body;

        // Check if the post ID is provided
        if (!_id) {
            return res.status(400).send({
                success: false,
                message: "Post ID is required"
            });
        }

        // Find the post by its ID
        const post = await PostModel.findById(_id);

        // Check if the post exists
        if (!post) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }

        // Delete the existing image associated with the post
        if (req.file) {
            // If there's a new image, delete the old one
            if (post.image) {
                // Delete the old image from the server
                fs.unlinkSync(`uploads/${post.image}`);
            }
            // Save the new image
            post.image = req.file.filename;
        }

        // Update other details
        post.title = title;
        post.description = description;
        post.user = user_id;

        // Save the updated post
        await post.save();

        return res.status(200).send({
            success: true,
            message: "Post updated successfully",
            post
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

const DeletePostController = async (req, res) => {
    const { _id } = req.body;

    try {
        // Check if the post ID is provided
        if (!_id) {
            return res.status(400).send({
                success: false,
                message: "Post ID is required"
            });
        }

        // Find the post by its ID
        const post = await PostModel.findById(_id);

        // Check if the post exists
        if (!post) {
            return res.status(404).send({
                success: false,
                message: "Post not found"
            });
        }

        // Delete the image from the folder
        if (post.image) {
            try {
                fs.unlinkSync(`uploads/${post.image}`);
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        // Delete the post from the database
        await PostModel.findByIdAndDelete(_id);

        return res.status(200).send({
            success: true,
            message: "Post deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = { PostController, PostsController, UpdatePostController, DeletePostController };
