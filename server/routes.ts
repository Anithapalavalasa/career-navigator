import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import exceljs from 'exceljs';

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post(api.admin.login.path, async (req, res) => {
    try {
      const input = api.admin.login.input.parse(req.body);
      // Hardcoded admin logic as requested
      if (input.username === 'admin' && input.password === 'admin123') {
        res.json({ success: true });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(401).json({ message: "Invalid input" });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post(api.registrations.create.path, async (req, res) => {
    try {
      const input = api.registrations.create.input.parse(req.body);
      const registration = await storage.createRegistration(input);
      res.status(201).json(registration);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get(api.registrations.list.path, async (_req, res) => {
    const data = await storage.getRegistrations();
    res.json(data);
  });

  app.get(api.registrations.download.path, async (_req, res) => {
    const data = await storage.getRegistrations();
    
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Registrations');
    
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Full Name', key: 'fullName', width: 30 },
      { header: 'DOB', key: 'dob', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Gender', key: 'gender', width: 10 },
      { header: 'Passed Year', key: 'passedYear', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Qualification', key: 'qualification', width: 20 },
      { header: 'District', key: 'district', width: 20 },
      { header: 'Caste', key: 'caste', width: 15 },
      { header: 'Preferred Location', key: 'preferredLocation', width: 20 },
      { header: 'Has Certificates', key: 'hasCertificates', width: 15 },
      { header: 'Certificate Details', key: 'certificateDetails', width: 40 },
      { header: 'Created At', key: 'createdAt', width: 25 },
    ];
    
    data.forEach((reg) => {
      worksheet.addRow(reg);
    });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.xlsx"');
    
    await workbook.xlsx.write(res);
    res.end();
  });

  return httpServer;
}