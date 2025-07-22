export const blogConfig = {
  title: "Cooper Wallace - DevSecOps Engineer",
  description: "Deep dives into DevSecOps, cloud architecture, and cutting-edge engineering practices",
  author: {
    name: "Cooper Wallace",
    image: "https://blog-photo-bucket.s3.amazonaws.com/high_qual_pfp_informal_cropped_circle.jpg",
    bio: "DevSecOps Engineer | Cloud Security Architect | Building secure, scalable systems",
    social: {
      github: "https://github.com/coopdloop",
      linkedin: "https://linkedin.com/in/cooper-wallace",
      twitter: "https://twitter.com/coopdloop"
    }
  },
  siteUrl: "https://your-blog-domain.com",
  postsPerPage: 10,
  categories: [
    "DevSecOps",
    "Security",
    "Cloud Architecture", 
    "Automation",
    "Compliance",
    "AI/ML",
    "Infrastructure"
  ]
};

export type BlogConfig = typeof blogConfig;