# Rotate MongoDB User Password (Recommended)

If your MongoDB connection string or password was exposed, rotate the DB user password immediately. Follow these steps in MongoDB Atlas.

1. Sign in to MongoDB Atlas: https://cloud.mongodb.com
2. Select your Project and Cluster (e.g., `varahi-dev`)
3. Left sidebar → **Database Access**
   - Locate the user (e.g., `apkrdevelopers_db_user`)
   - Click **Edit** → Enter a new strong password → **Update User**

4. Left sidebar → **Network Access**
   - Ensure your deployment's IPs are allowed. For dev you may add `0.0.0.0/0` (not recommended for production).

5. Left sidebar → **Databases** → Click **Connect** → **Connect your application**
   - Copy the connection string and replace `<password>` with the new password.
   - Append the database name if needed: `/trading-inventory?retryWrites=true&w=majority`

6. Update the secrets:
   - GitHub Actions secret: `DEV_MONGODB_URI` → update to the new connection string
   - Vercel env var: `MONGODB_URI` → update to the new connection string

7. Re-deploy/test:
   - Push a small commit to `develop` to trigger the GitHub Actions workflow.
   - Verify the app connects to the DB and functions correctly.

Security notes:
- Use a strong randomly-generated password.
- For production, restrict IP access and consider using VPC peering or private networking.
- Rotate credentials periodically and follow principle of least privilege.
