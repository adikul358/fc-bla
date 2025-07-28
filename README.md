# Founder's Club Backend Lead Assignment

### Objectives
1. `/api` endpoint returns a JSON array of the episode data of _The Last of Us_ season 2 (a show I am currently watching).
2. `/signup`, `/signin`, `/signout` manage authentication flow using JWT session cookies.
3. If logged in, `/api/me` returns the JSON array of episodes, including your ratings. Otherwise it redirects to `/api`
4. Users are stored in memory in an array, their passwords hashed with a salt using the `bcrypt` library

### Usage

You can use the API hosted on [fc-bla.projects.adikul.dev](fblt.projects.adikul.dev) with any API client. An HAR (HTTP Archive Format) file with test queries is included.

<img width="3336" height="2158" alt="Screenshot 2025-07-28 at 11 45 25" src="https://github.com/user-attachments/assets/80073069-b3d8-4324-a105-97636b331f6b" />
<img width="3336" height="2158" alt="Screenshot 2025-07-28 at 11 45 38" src="https://github.com/user-attachments/assets/dfe788cb-1992-4bb7-9847-2000106dd572" />
<img width="3336" height="2158" alt="Screenshot 2025-07-28 at 11 46 04" src="https://github.com/user-attachments/assets/5bd1ee6b-eaf6-4843-9649-329eacee815b" />
<img width="3336" height="2158" alt="Screenshot 2025-07-28 at 11 45 54" src="https://github.com/user-attachments/assets/0a5e93c0-6725-414e-80e0-d4d65c416b59" />


### Setup

To install dependencies:

```bash
bun install
```

To run development:

```bash
bun dev
```

To run production:

```bash
bun start
```

This project was created using `bun init` in bun v1.2.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Deployment

The project can be deployed as a Docker container on a service like GCP Cloud Run.

Setup GCP Local CLI
```
gcloud config set project [PROJECT_ID]
gcloud services enable artifactregistry.googleapis.com
gcloud auth configure-docker
```

Build container and push to registry
```
docker build -t asia-east1-docker.pkg.dev/portfolio-454511/fc-bla/fc-bla:latest .
docker push asia-east1-docker.pkg.dev/portfolio-454511/fc-bla/fc-bla:latest
gcloud container images list --repository=fc-bla
```
