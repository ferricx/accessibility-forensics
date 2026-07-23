# Cloudflare Pages Hosting Setup Guide

Since you already purchased your domain through Cloudflare, hosting your site via Cloudflare Pages is the easiest, fastest, and most secure method. Here are the step-by-step instructions.

## Step 1: Push Your Code to GitHub (Recommended)
Cloudflare Pages integrates seamlessly with GitHub, allowing automatic updates whenever you change your code.

1. Go to [GitHub](https://github.com/) and create a new repository (e.g., `accessibility-forensics-site`).
2. Run these commands in your VS Code terminal (for `/workspaces/accessibility-forensics`):
   ```bash
   git init
   git add index.html
   git commit -m "Initial commit of landing page"
   git branch -M main
   git remote add origin https://github.com/USERNAME/accessibility-forensics-site.git
   git push -u origin main
   ```

*(Alternatively, Cloudflare allows you to manually upload a `.zip` file of your folder or drag-and-drop the files via their dashboard if you don't want to use GitHub right now).*

## Step 2: Create a Cloudflare Pages Project

1. Log in to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. On the left sidebar, click **Workers & Pages**, then click **Create**.
3. Select the **Pages** tab.
4. Choose **Connect to Git** (if you used Step 1) or **Upload Assets** (to manually upload your files).
5. If connecting Git:
    - Authorize Cloudflare to access your GitHub account.
    - Select your repository (`accessibility-forensics-site`).
    - Click **Begin setup**.
6. On the setup page:
    - **Project name:** (e.g., `accessibility-forensics`)
    - **Production branch:** `main`
    - **Framework preset:** `None` (since this is a plain HTML file).
    - **Build command:** Leave empty.
    - **Build output directory:** Leave empty.
7. Click **Save and Deploy**. Cloudflare will build and give you a temporary `something.pages.dev` link.

## Step 3: Link Your Custom Domain

Because your domain is already registered with Cloudflare, linking it to the Pages project is completely automated.

1. Once the deployment finishes, click **Continue to project**.
2. Go to the **Custom Domains** tab in your Pages project.
3. Click **Set up a custom domain**.
4. Type in your custom domain (e.g., `accessibilityforensics.com`).
5. Click **Continue**.
6. Cloudflare will automatically detect that you own the domain on their platform and configure the required DNS records (CNAME) and SSL certificates for you in one click.
7. Click **Activate domain**.

Within a few minutes, your SSL will be provisioned, and your site will be live on your custom domain!
