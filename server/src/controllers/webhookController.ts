import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { TrackingService } from '../services/trackingService';
import { logger } from '../utils/logger';
import { io } from '../server';

export class WebhookController {
  /**
   * POST /api/webhooks/razorpay
   * Razorpay Webhook Ingestion
   */
  static async handleRazorpayWebhook(req: Request, res: Response): Promise<void> {
    try {
      const signature = (req.headers['x-razorpay-signature'] as string) || '';
      const rawBody = JSON.stringify(req.body);

      const result = await PaymentService.processWebhook(rawBody, signature, req.body);
      res.status(200).json({ status: 'ok', result });
    } catch (error: any) {
      logger.error('Error in Razorpay Webhook:', error.message);
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  /**
   * POST /api/webhooks/telematics
   * Ingest external GPS IoT / telematics device telemetry for live fleet tracking
   */
  static async handleTelematicsWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { driverId, vehicleId, latitude, longitude, speed, heading, timestamp, address } = req.body;

      if (!driverId || latitude === undefined || longitude === undefined) {
        res.status(400).json({ status: 'error', message: 'driverId, latitude, and longitude are required' });
        return;
      }

      const updated = await TrackingService.updateDriverLocation(
        driverId,
        Number(latitude),
        Number(longitude),
        Number(heading || 0),
        Number(speed || 0),
        address || 'Live Telematics Stream'
      );

      if (io) {
        io.emit('driver:location_update', {
          driverId,
          vehicleId,
          lat: latitude,
          lng: longitude,
          heading,
          speed,
          timestamp: timestamp || new Date().toISOString(),
        });
      }

      res.status(200).json({ status: 'ok', data: updated });
    } catch (error: any) {
      logger.error('Error in Telematics Webhook:', error.message);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  /**
   * POST /api/webhooks/sms
   * SMS Gateway delivery status callbacks
   */
  static async handleSmsWebhook(req: Request, res: Response): Promise<void> {
    try {
      const { messageId, status, mobile } = req.body;
      logger.info(`📱 SMS Gateway Webhook: Message ${messageId} to ${mobile} status: ${status}`);
      res.status(200).json({ status: 'ok' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}
