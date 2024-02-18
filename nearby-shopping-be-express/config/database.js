const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
	'https://xybtuvhqchrmqjkujlqd.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5YnR1dmhxY2hybXFqa3VqbHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgyNDQ2OTEsImV4cCI6MjAyMzgyMDY5MX0.tARtNVjXtqfTzIpK-XgNN74-g2ZUWNavECHIibgG6aw'
);

module.exports = supabase;
