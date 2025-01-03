import { Router, Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/calls', asyncHandler(async (req: any, res: Response) => {
  const { phoneNumber } = req.body;
  const result = await req.retell.initiateCall(phoneNumber);
  res.json(result);
}));

router.get('/calls/:callId/recording', asyncHandler(async (req: any, res: Response) => {
  const recording = await req.retell.getCallRecording(req.params.callId);
  res.type('audio/wav').send(recording);
}));

router.put('/calls/:callId/config', asyncHandler(async (req: any, res: Response) => {
  await req.retell.updateCallConfig(req.params.callId, req.body);
  res.status(204).send();
}));

export const communicationRoutes: Router = router;