import { Router } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
const router = Router();
// Get staff training
router.get('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.query;
    let query = req.supabase
        .from('staff_training')
        .select('*')
        .eq('staff_id', id);
    if (status) {
        query = query.eq('status', status);
    }
    const { data: training, error } = await query.order('due_date', { ascending: true });
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(training);
}));
// Add training record
router.post('/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, type, due_date, validity_period, materials_url } = req.body;
    const { data: training, error } = await req.supabase
        .from('staff_training')
        .insert({
        staff_id: id,
        title,
        description,
        type,
        due_date,
        validity_period,
        materials_url,
        assigned_by: req.user?.id
    })
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.status(201).json(training);
}));
// Update training status
router.put('/:id/:training_id', asyncHandler(async (req, res) => {
    const { id, training_id } = req.params;
    const { status, completion_date, certification_url } = req.body;
    const { data: training, error } = await req.supabase
        .from('staff_training')
        .update({
        status,
        completion_date,
        certification_url
    })
        .eq('id', training_id)
        .eq('staff_id', id)
        .select()
        .single();
    if (error) {
        return res.status(500).json({ error: error.message });
    }
    return res.json(training);
}));
export { router as trainingRoutes };
