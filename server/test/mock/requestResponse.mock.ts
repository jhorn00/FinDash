import { Request, Response } from 'express';

export const createMockRequest = (body: any, files: any) => {
  const mockRequest: Partial<Request> = {
    body,
    files,
  };
  return mockRequest as Request;
};

export const createMockResponse = () => {
  const mockResponse: Partial<Response> = {
    send: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockReturnThis(),
  };
  return mockResponse as Response;
};
