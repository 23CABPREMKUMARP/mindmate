-- Run this in Supabase SQL editor to create the face recognition table
CREATE TABLE public.face_embeddings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    embedding JSONB NOT NULL, -- Storing the 128 Float32 Array as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
