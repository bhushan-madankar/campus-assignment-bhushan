const express = require('express');
const router = express.Router();

const { getResources, createResource, updateResource, deleteResource } = require('../controller/resourceController');

router.post('/resources', createResource);
router.get('/resources', getResources);
router.put('/resources/:id', updateResource);
router.delete('/resources/:id', deleteResource);

module.exports = router; 