-- Create enum types
CREATE TYPE course_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE enrollment_status AS ENUM ('enrolled', 'in_progress', 'completed', 'dropped');
CREATE TYPE resource_type AS ENUM ('document', 'video', 'audio', 'link', 'quiz');
CREATE TYPE certification_status AS ENUM ('not_started', 'in_progress', 'completed', 'expired');

-- Create courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status course_status NOT NULL DEFAULT 'draft',
    category VARCHAR(100),
    duration INTEGER, -- in minutes
    prerequisites JSONB DEFAULT '[]'::jsonb,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    thumbnail_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course modules table
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create module content table
CREATE TABLE module_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_type resource_type NOT NULL,
    content_url TEXT,
    content_data JSONB, -- For quizzes or other structured content
    order_index INTEGER NOT NULL,
    duration INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create course enrollments table
CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status enrollment_status NOT NULL DEFAULT 'enrolled',
    progress INTEGER DEFAULT 0, -- percentage
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completion_date TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, user_id)
);

-- Create module progress table
CREATE TABLE module_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES course_enrollments(id) ON DELETE CASCADE,
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    content_id UUID REFERENCES module_content(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    completion_date TIMESTAMP WITH TIME ZONE,
    quiz_score INTEGER,
    time_spent INTEGER, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(enrollment_id, module_id, content_id)
);

-- Create learning resources table
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type resource_type NOT NULL,
    category VARCHAR(100),
    tags JSONB DEFAULT '[]'::jsonb,
    url TEXT,
    file_data JSONB, -- For file metadata
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issuing_authority VARCHAR(255),
    validity_period INTEGER, -- in months
    requirements JSONB DEFAULT '[]'::jsonb,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user certifications table
CREATE TABLE user_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certification_id UUID REFERENCES certifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status certification_status NOT NULL DEFAULT 'not_started',
    issue_date TIMESTAMP WITH TIME ZONE,
    expiry_date TIMESTAMP WITH TIME ZONE,
    certificate_url TEXT,
    verification_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(certification_id, user_id)
);

-- Create indexes
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_course_modules_course_id ON course_modules(course_id);
CREATE INDEX idx_course_modules_order ON course_modules(order_index);
CREATE INDEX idx_module_content_module_id ON module_content(module_id);
CREATE INDEX idx_module_content_order ON module_content(order_index);
CREATE INDEX idx_course_enrollments_user_id ON course_enrollments(user_id);
CREATE INDEX idx_course_enrollments_status ON course_enrollments(status);
CREATE INDEX idx_module_progress_enrollment_id ON module_progress(enrollment_id);
CREATE INDEX idx_learning_resources_type ON learning_resources(resource_type);
CREATE INDEX idx_learning_resources_category ON learning_resources(category);
CREATE INDEX idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX idx_user_certifications_status ON user_certifications(status);

-- Create triggers for updating updated_at
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_modules_updated_at
    BEFORE UPDATE ON course_modules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_content_updated_at
    BEFORE UPDATE ON module_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_course_enrollments_updated_at
    BEFORE UPDATE ON course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_progress_updated_at
    BEFORE UPDATE ON module_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at
    BEFORE UPDATE ON learning_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at
    BEFORE UPDATE ON certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_certifications_updated_at
    BEFORE UPDATE ON user_certifications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Courses
CREATE POLICY "Enable read access for authenticated users" ON courses
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff') OR status = 'published');

CREATE POLICY "Enable full access for admins" ON courses
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Course Modules
CREATE POLICY "Enable read access for authenticated users" ON course_modules
    FOR SELECT
    USING (
        auth.role() IN ('admin', 'staff') OR 
        EXISTS (
            SELECT 1 FROM courses 
            WHERE courses.id = course_modules.course_id 
            AND status = 'published'
        )
    );

CREATE POLICY "Enable full access for admins" ON course_modules
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Module Content
CREATE POLICY "Enable read access for authenticated users" ON module_content
    FOR SELECT
    USING (
        auth.role() IN ('admin', 'staff') OR 
        EXISTS (
            SELECT 1 FROM course_modules 
            JOIN courses ON courses.id = course_modules.course_id
            WHERE course_modules.id = module_content.module_id 
            AND courses.status = 'published'
        )
    );

CREATE POLICY "Enable full access for admins" ON module_content
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Course Enrollments
CREATE POLICY "Enable read access for own enrollments" ON course_enrollments
    FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Enable enrollment for authenticated users" ON course_enrollments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own enrollments" ON course_enrollments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Module Progress
CREATE POLICY "Enable read access for own progress" ON module_progress
    FOR SELECT
    USING (
        auth.role() = 'admin' OR 
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.id = module_progress.enrollment_id 
            AND course_enrollments.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable update for own progress" ON module_progress
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM course_enrollments 
            WHERE course_enrollments.id = module_progress.enrollment_id 
            AND course_enrollments.user_id = auth.uid()
        )
    );

-- Learning Resources
CREATE POLICY "Enable read access for authenticated users" ON learning_resources
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON learning_resources
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- Certifications
CREATE POLICY "Enable read access for authenticated users" ON certifications
    FOR SELECT
    USING (auth.role() IN ('admin', 'staff'));

CREATE POLICY "Enable full access for admins" ON certifications
    FOR ALL
    USING (auth.role() = 'admin')
    WITH CHECK (auth.role() = 'admin');

-- User Certifications
CREATE POLICY "Enable read access for own certifications" ON user_certifications
    FOR SELECT
    USING (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Enable update for own certifications" ON user_certifications
    FOR UPDATE
    USING (auth.uid() = user_id OR auth.role() = 'admin')
    WITH CHECK (auth.uid() = user_id OR auth.role() = 'admin');

CREATE POLICY "Enable insert for admins" ON user_certifications
    FOR INSERT
    WITH CHECK (auth.role() = 'admin');