import pool from '../config/db.js';

async function updateTable() {
    try {
        console.log("Checking and updating 'sinal' table...");

        // Add url_modelo_3d
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sinal' AND column_name='url_modelo_3d') THEN 
                    ALTER TABLE sinal ADD COLUMN url_modelo_3d TEXT; 
                    RAISE NOTICE 'Added url_modelo_3d column';
                END IF;
            END $$;
        `);

        // Add url_animacao
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sinal' AND column_name='url_animacao') THEN 
                    ALTER TABLE sinal ADD COLUMN url_animacao TEXT; 
                    RAISE NOTICE 'Added url_animacao column';
                END IF;
            END $$;
        `);

        console.log("Update completed successfully.");
    } catch (error) {
        console.error("Error updating table:", error);
    } finally {
        pool.end(); // Close connection
    }
}

updateTable();
