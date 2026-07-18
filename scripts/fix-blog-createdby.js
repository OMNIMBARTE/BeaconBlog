/**
 * One-time migration: fixes blog documents where `createdBy` was saved
 * as a plain string (old buggy schema) instead of a real ObjectId.
 *
 * Safe to run multiple times — it only touches documents where createdBy
 * is currently a string, and skips/reports anything it can't fix.
 *
 * Usage:
 *   node scripts/fix-blog-createdby.js
 *
 * Make sure MONGO_URL in your .env points at the SAME database you want
 * to fix (e.g. your AWS-hosted MongoDB), not localhost.
 */

require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
    if (!process.env.MONGO_URL) {
        console.error("MONGO_URL is not set. Aborting.");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to:", process.env.MONGO_URL);

    const db = mongoose.connection.db;
    const blogs = db.collection("blogs");

    // Find every blog whose createdBy is currently stored as a string.
    const cursor = blogs.find({ createdBy: { $type: "string" } });

    let scanned = 0;
    let fixed = 0;
    let skipped = 0;

    for await (const blog of cursor) {
        scanned++;

        if (!mongoose.Types.ObjectId.isValid(blog.createdBy)) {
            console.warn(`Skipping blog ${blog._id}: createdBy "${blog.createdBy}" is not a valid ObjectId.`);
            skipped++;
            continue;
        }

        await blogs.updateOne(
            { _id: blog._id },
            { $set: { createdBy: new mongoose.Types.ObjectId(blog.createdBy) } }
        );
        fixed++;
        console.log(`Fixed blog ${blog._id}`);
    }

    console.log("---");
    console.log(`Scanned: ${scanned}`);
    console.log(`Fixed:   ${fixed}`);
    console.log(`Skipped: ${skipped}`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
});
