-- Seed data for testing

-- Insert test users (passwords are 'password123')
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, raw_app_meta_data, raw_user_meta_data)
VALUES
  ('d0d54aa8-4c56-4a7e-8c3d-0453c96b4c54', 'admin@example.com', '$2a$10$PxhHo/C4KGN4V/5Zm8D5AeYGUciV9iLFDYVE.1zrI5Ocj.V4YIZB6', NOW(), 'authenticated', '{"provider": "email", "providers": ["email"], "role": "admin"}', '{"full_name": "Dr. Emily Parker", "role": "admin", "title": "Practice Administrator", "department": "Administration"}'),
  ('f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', 'staff@example.com', '$2a$10$PxhHo/C4KGN4V/5Zm8D5AeYGUciV9iLFDYVE.1zrI5Ocj.V4YIZB6', NOW(), 'authenticated', '{"provider": "email", "providers": ["email"], "role": "staff"}', '{"full_name": "Dr. Sarah Wilson", "role": "staff", "title": "Lead Dentist", "department": "General Dentistry"}');

-- Insert test patients
INSERT INTO patients (id, user_id, first_name, last_name, email, phone, date_of_birth, address, medical_history)
VALUES
  ('a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', NULL, 'John', 'Doe', 'john.doe@example.com', '555-0101', '1980-01-15',
   '{"street": "123 Main St", "city": "Anytown", "state": "CA", "zip": "12345"}',
   '{"allergies": ["penicillin"], "conditions": ["hypertension"], "medications": ["lisinopril"]}'),
		('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', NULL, 'Jane', 'Smith', 'jane.smith@example.com', '555-0102', '1992-03-20',
			'{"street": "456 Oak Ave", "city": "Somewhere", "state": "CA", "zip": "12346"}',
			'{"allergies": [], "conditions": [], "medications": []}'),
		('c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', NULL, 'Bob', 'Johnson', 'bob.johnson@example.com', '555-0103', '1975-07-10',
   '{"street": "789 Pine St", "city": "Elsewhere", "state": "CA", "zip": "12347"}',
   '{"allergies": ["latex"], "conditions": ["diabetes"], "medications": ["metformin"]}'),
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g', NULL, 'Sarah', 'Johnson', 'sarah.johnson@example.com', '555-0104', '1985-04-15',
			'{"street": "789 Pine St", "city": "Elsewhere", "state": "CA", "zip": "12347"}',
			'{"allergies": [], "conditions": [], "medications": []}');

-- Insert test appointments
INSERT INTO appointments (id, patient_id, staff_id, appointment_date, status, type, notes)
VALUES
  ('d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', NOW() + INTERVAL '2 hours', 'scheduled', 'Cleaning', 'Regular checkup and cleaning'),
		('e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8g9h', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', NOW() + INTERVAL '1 day', 'scheduled', 'Filling', 'Cavity filling - tooth #14'),
		('f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', NOW() - INTERVAL '1 day', 'completed', 'Consultation', 'Initial consultation for orthodontic treatment');

-- Insert test payments
INSERT INTO payments (id, patient_id, appointment_id, amount, status, payment_date, payment_method)
VALUES
  ('g7h8i9j0-k1l2-4m3n-4o5p-6q7r8s9t0u1', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g', 150.00, 'completed', NOW(), 'credit_card'),
  ('h8i9j0k1-l2m3-4n4o-5p6q-7r8s9t0u1v2', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8g9h', 250.00, 'pending', NULL, 'insurance'),
  ('i9j0k1l2-m3n4-4o5p-6q7r-8s9t0u1v2w3', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8g9h0i', 100.00, 'completed', NOW() - INTERVAL '1 day', 'cash');

-- Insert test reports
INSERT INTO reports (id, patient_id, staff_id, type, status, content)
VALUES
  ('j0k1l2m3-n4o5-4p6q-7r8s-9t0u1v2w3x4', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', 'Treatment Plan', 'pending', '{"procedure": "Deep Cleaning", "estimated_cost": 300.00}'),
  ('k1l2m3n4-o5p6-4q7r-8s9t-0u1v2w3x4y5', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', 'X-Ray Analysis', 'completed', '{"findings": "No cavities detected", "recommendations": "Continue regular cleaning"}'),
  ('l2m3n4o5-p6q7-4r8s-9t0u-1v2w3x4y5z6', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e', 'Orthodontic Assessment', 'pending', '{"treatment_duration": "18 months", "estimated_cost": 5000.00}');

-- Insert family relationships
INSERT INTO family_relationships (id, patient_id, related_patient_id, relationship_type)
VALUES
  ('m3n4o5p6-q7r8-4s9t-0u1v-2w3x4y5z6a7', 'c3d4e5f6-a7b8-4c9d-0e1f-2a3b4c5d6e7f', 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f8g', 'spouse'),
  ('n4o5p6q7-r8s9-4t0u-1v2w-3x4y5z6a7b8', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'sibling');

-- Insert treatment plans
INSERT INTO treatment_plans (id, patient_id, title, description, procedures, estimated_cost, duration, status, created_by)
VALUES
  ('o5p6q7r8-s9t0-4u1v-2w3x-4y5z6a7b8c9', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
   'Complete Dental Restoration',
   'Full mouth restoration including crowns and bridges',
   '[
     {"type": "crown", "tooth": "14", "material": "porcelain", "cost": 1200},
     {"type": "bridge", "teeth": ["24", "25", "26"], "material": "porcelain-fused-to-metal", "cost": 3000}
   ]',
   4200.00,
   '3 months',
   'planned',
   'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e'),
  ('p6q7r8s9-t0u1-4v2w-3x4y-5z6a7b8c9d0', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
   'Orthodontic Treatment',
   'Clear aligners for teeth straightening',
   '[
     {"type": "clear_aligners", "duration": "18 months", "visits": 12, "cost": 5000}
   ]',
   5000.00,
   '18 months',
   'in_progress',
   'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e');

-- Insert patient documents
INSERT INTO patient_documents (id, patient_id, type, file_path, description, uploaded_by)
VALUES
  ('q7r8s9t0-u1v2-4w3x-4y5z-6a7b8c9d0e1', 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
   'x_ray',
   'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d/dental_xray_2024.jpg',
   'Full mouth X-ray for treatment planning',
   'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e'),
  ('r8s9t0u1-v2w3-4x4y-5z6a-7b8c9d0e1f2', 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
   'consent_form',
   'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e/treatment_consent.pdf',
   'Signed consent form for orthodontic treatment',
   'f5c4d3b2-a1e0-4b9f-8c7d-6e5d4c3b2a1e');