// Service Controller - Catalog and Administration
import { dbStore } from '../config/db.js';

export function getAllServices(req, res) {
  try {
    const { searchTerm, category, area, maxPrice, sortBy } = req.query;
    let services = [...dbStore.getServices()];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      services = services.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.nameBn && s.nameBn.includes(term)) ||
        s.description.toLowerCase().includes(term) ||
        s.category.toLowerCase().includes(term)
      );
    }

    if (category && category !== 'All') {
      services = services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }

    if (area && area !== 'All') {
      services = services.filter(s => s.serviceAreas && s.serviceAreas.includes(area));
    }

    if (maxPrice) {
      const max = Number(maxPrice);
      if (!isNaN(max)) {
        services = services.filter(s => s.basePrice <= max);
      }
    }

    if (sortBy === 'price_asc') {
      services.sort((a, b) => a.basePrice - b.basePrice);
    } else if (sortBy === 'price_desc') {
      services.sort((a, b) => b.basePrice - a.basePrice);
    } else if (sortBy === 'rating') {
      services.sort((a, b) => b.rating - a.rating);
    }

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve services.' });
  }
}

export function getServiceById(req, res) {
  try {
    const { id } = req.params;
    const service = dbStore.getServiceById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // Attach verified customer reviews for this service
    const reviews = dbStore.getReviews(id);

    return res.status(200).json({
      success: true,
      data: {
        ...service,
        reviews
      }
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve service.' });
  }
}

export function createService(req, res) {
  try {
    const { name, category, description, basePrice, priceUnit = "unit", estimatedDuration = "60 mins", warrantyDays = 30, image, serviceAreas, features } = req.body;

    if (!name || !category || !basePrice) {
      return res.status(400).json({ success: false, message: 'Name, category, and base price are required.' });
    }

    const newService = {
      id: 'srv-' + Date.now(),
      name: name.trim(),
      category: category.trim(),
      categoryBn: name.trim(),
      description: description || '',
      basePrice: Number(basePrice),
      priceUnit,
      estimatedDuration,
      warrantyDays: Number(warrantyDays) || 30,
      image: image || '/src/assets/why_choose_us/service-1.jpg',
      rating: 5.0,
      reviewsCount: 0,
      serviceAreas: Array.isArray(serviceAreas) && serviceAreas.length > 0 ? serviceAreas : ["Gulshan", "Dhanmondi", "Uttara", "Mirpur"],
      features: Array.isArray(features) ? features : ["Doorstep inspection", "Verified technicians", "Satisfaction guarantee"]
    };

    dbStore.getServices().push(newService);

    dbStore.addAuditLog({
      action: "SERVICE_CREATED",
      performedBy: req.user.email,
      targetId: newService.id,
      details: `Created new service: ${newService.name} (৳${newService.basePrice})`
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    return res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
}

export function updateService(req, res) {
  try {
    const { id } = req.params;
    const service = dbStore.getServiceById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const { name, category, description, basePrice, priceUnit, estimatedDuration, warrantyDays, image, serviceAreas, features } = req.body;

    if (name) { service.name = name; service.nameBn = name; }
    if (category) service.category = category;
    if (description !== undefined) service.description = description;
    if (basePrice !== undefined) service.basePrice = Number(basePrice);
    if (priceUnit) service.priceUnit = priceUnit;
    if (estimatedDuration) service.estimatedDuration = estimatedDuration;
    if (warrantyDays !== undefined) service.warrantyDays = Number(warrantyDays);
    if (image) service.image = image;
    if (serviceAreas) service.serviceAreas = serviceAreas;
    if (features) service.features = features;

    dbStore.addAuditLog({
      action: "SERVICE_UPDATED",
      performedBy: req.user.email,
      targetId: id,
      details: `Updated service: ${service.name}`
    });

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      data: service
    });
  } catch (error) {
    console.error('Error updating service:', error);
    return res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
}

export function deleteService(req, res) {
  try {
    const { id } = req.params;
    const services = dbStore.getServices();
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const removed = services.splice(idx, 1)[0];

    dbStore.addAuditLog({
      action: "SERVICE_DELETED",
      performedBy: req.user.email,
      targetId: id,
      details: `Deleted service: ${removed.name}`
    });

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
}
