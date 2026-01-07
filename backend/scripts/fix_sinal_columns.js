import pool from '../config/db.js';

async function updateTable() {
    try {
        console.log("Checking and fixing 'sinal' table columns...");

        // Add fonte
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sinal' AND column_name='fonte') THEN 
                    ALTER TABLE sinal ADD COLUMN fonte VARCHAR(200); 
                    RAISE NOTICE 'Added fonte column';
                END IF;
            END $$;
        `);

        // Add tags
        await pool.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sinal' AND column_name='tags') THEN 
                    ALTER TABLE sinal ADD COLUMN tags TEXT[]; 
                    RAISE NOTICE 'Added tags column';
                END IF;
            END $$;
        `);

        console.log("Fix completed successfully.");
    } catch (error) {
        console.error("Error updating table:", error);
    } finally {
        pool.end();
    }
}

updateTable();
