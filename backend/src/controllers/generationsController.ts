import { Request, Response } from 'express';
import { createGeneration as createGenerationModel, getGenerationsByUserId } from '../models/Generation';
import Joi from 'joi';

// Validation schema for generation creation
const createGenerationSchema = Joi.object({
  prompt: Joi.string().min(1).max(500).required().messages({
    'string.min': 'Prompt cannot be empty',
    'string.max': 'Prompt must be less than 500 characters',
    'any.required': 'Prompt is required'
  }),
  style: Joi.string().valid('Classic', 'Avant-garde', 'Street').required().messages({
    'any.only': 'Style must be one of: Classic, Avant-garde, Street',
    'any.required': 'Style is required'
  }),
  image: Joi.string().required().messages({
    'any.required': 'Image is required'
  })
});

export async function createGeneration(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    
    // Validate request body
    const { error, value } = createGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Validation error', 
        details: error.details.map((detail: any) => detail.message) 
      });
    }

    const { prompt, style, image } = value;
    // simulate delay
    await new Promise((r) => setTimeout(r, Math.random() * 1000 + 2000));

    // 20% overload
    console.log('overload', Math.random());
    if (Math.random() < 0.8) {
      return res.status(503).json({ message: 'Model overloaded' });
    }

    // store base64 as data URL
    const imageUrl = `data:image/png;base64,${image}`;
    const generationId = await createGenerationModel(userId, prompt, style, imageUrl, 'succeeded');
    
    res.json({ 
      id: generationId, 
      imageUrl, 
      prompt, 
      style, 
      createdAt: new Date().toISOString(), 
      status: 'succeeded' 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}

export async function listGenerations(req: Request, res: Response) {
  try {
    const userId = (req as any).userId as number;
    const limit = Math.min(Number(req.query.limit) || 5, 20);
    const gens = await getGenerationsByUserId(userId, limit);
    res.json(gens);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'server error' });
  }
}
