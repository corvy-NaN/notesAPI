/*
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('Testing Supabase connection...');
console.log('URL:', supabaseUrl);
console.log('Key (first 20 chars):', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // Test 1: Conexión básica
        console.log('\n🔍 Probando conexión...');
        const { data, error } = await supabase
            .from('notes')
            .select('*')
            .limit(1);
            
        if (error) {
            console.error('❌ Error:', error);
            return;
        }
        
        console.log('✅ Conexión exitosa');
        console.log('Data:', data);
        
        // Test 2: Insertar datos
        console.log('\n🔍 Probando inserción...');
        const { data: insertData, error: insertError } = await supabase
            .from('notes')
            .insert([{ title: 'Test Note', content: 'Test content', user_id: '550e8400-e29b-41d4-a716-446655440000' }]);
            
        if (insertError) {
            console.error('❌ Error al insertar:', insertError);
        } else {
            console.log('✅ Inserción exitosa:', insertData);
        }
        
    } catch (err) {
        console.error('❌ Error inesperado:', err);
    }
}

testConnection();

 */

import bcrypt from 'bcrypt';
(async () => {
  const hashed = await bcrypt.hash('123456', 10);
  console.log(hashed);
})();