// getResources, createResource, updateResource, deleteResource

const Resource = require('../model/resourceModel');

const getResources = async (req, res) => {
    try {
        const resources = await Resource.find();
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching resources' });
    }
}

const createResource = async (req, res) => {
    const { title, description, resourceType } = req.body;

    try {
        const newResource = new Resource({
            title,
            description,
            resourceType
        });
        await newResource.save();
        // Log the added resource to the backend console
        console.log('Resource added:', newResource);
        res.status(201).json(newResource);
    } catch (error) {
        res.status(500).json({ message: 'Error creating resource' });
    }
}

const updateResource = async (req, res) => {
    const { id } = req.params;
    const { title, description, resourceType } = req.body;
    try {
        const updatedResource = await Resource.findByIdAndUpdate(id, { title, description, resourceType }, { new: true });
        if (!updatedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json(updatedResource);
    } catch (error) {
        res.status(500).json({ message: 'Error updating resource' });
    }
}

const deleteResource = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedResource = await Resource.findByIdAndDelete(id);
        if (!deletedResource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        res.status(200).json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting resource' });
    }
}

module.exports = {
    getResources,
    createResource,
    updateResource,
    deleteResource
};