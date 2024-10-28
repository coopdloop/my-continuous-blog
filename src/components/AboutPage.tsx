import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const AboutPage: React.FC = () => {
  const identity = {
    firstName: "Cooper",
    lastName: "Wallace",
    country: "USA",
    occupation: "Lead Cloud Security Engineer",
    hobbies: [
      "Hiking",
      "Gym",
      "Full-stack web development",
      "Cooking",
      "Application Security",
      "Philosophy",
    ],
    email: "cooper@lariatlabs.dev",
    skills: [
      "Kubernetes",
      "React",
      "DevSecOps",
      "Javascript",
      "Python",
      "Golang",
      "Rust",
      "Bash scripting",
      "Full-Stack Development",
      "CI/CD Pipelines",
      "SAST/DAST tooling",
      "Code reviews",
      "SCA",
      "AWS",
      "GCP",
    ],
  };

  const experience = [
    {
      title: "Lead Cloud Security Engineer",
      companyName: "Zerofox",
      imageUrl: "https://embed-ssl.wistia.com/deliveries/1b1347fa71c7b54d5b498a938f9dfeb9.webp?image_crop_resized=960x540",
      workDurationEnd: "Current",
      workDurationStart: "Mar 2022"
    },
    {
      title: "Sr. Security Engineer",
      companyName: "Ankura",
      imageUrl: "https://forms.ankura.com/hs-fs/hubfs/Logos/New%20Logo-01.png?width=950&height=263&name=New%20Logo-01.png",
      workDurationEnd: "Mar 2022",
      workDurationStart: "Dec 2018"
    }
  ];

  const certifications = [
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ics2.png",
      certTitle: "Systems Security Certified Practitioner (SSCP)",
      certIssuer: "ISC2",
      issueDate: "Aug 2022"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/elearn.png",
      certTitle: "eWPTX",
      certIssuer: "eLearnSecurity",
      issueDate: "Jul 2024"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ec_c_logo.png",
      certTitle: "EC-Council Certified Ethical Hacker (CEH)",
      certIssuer: "EC-Council",
      issueDate: "Jun 2021"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ec_c_logo.png",
      certTitle: "EC-Council Certified Encryption Specialist (ECES)",
      certIssuer: "EC-Council",
      issueDate: "Jan 2022"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png",
      certTitle: "Security+",
      certIssuer: "CompTIA",
      issueDate: "Mar 2020"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png",
      certTitle: "CySA+",
      certIssuer: "CompTIA",
      issueDate: "May 2020"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png",
      certTitle: "Network+",
      certIssuer: "CompTIA",
      issueDate: "Mar 2021"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png",
      certTitle: "Project+",
      certIssuer: "CompTIA",
      issueDate: "Jul 2022"
    },
    {
      imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png",
      certTitle: "PenTest+",
      certIssuer: "CompTIA",
      issueDate: "Feb 2023"
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 rounded-lg">
      <Card className="max-w-4xl mx-auto bg-slate-300 rounded-lg shadow-xl overflow-hidden border-none">
        <CardHeader className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              src="/public/me.jpg"
              alt="Cooper Wallace"
              className="h-full w-full transition-all md:h-full md:w-60 object-cover"
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              {identity.occupation}
            </div>
            <CardTitle className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {identity.firstName} {identity.lastName}
            </CardTitle>
            <p className="mt-2 text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {identity.country}
            </p>
            <p className="mt-2 text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <a href={`mailto:${identity.email}`} className="text-indigo-600 hover:text-indigo-800">
                {identity.email}
              </a>
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-8 text-black">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About Me</h2>
            <p className="text-gray-700">
              I have a strong passion for Cybersecurity and application development, both stemming from my love of programming. I constantly strive to learn new things and am always looking for new challenges.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {identity.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Hobbies</h2>
            <ul className="list-disc list-inside">
              {identity.hobbies.map((hobby) => (
                <li key={hobby} className="text-gray-700">{hobby}</li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-4">
              {experience.map((job) => (
                <div key={job.companyName} className="flex items-start">
                  <img src={job.imageUrl} alt={job.companyName} className="w-16 h-16 object-contain mr-4" />
                  <div>
                    <h3 className="font-bold">{job.title}</h3>
                    <p className="text-gray-600">{job.companyName}</p>
                    <p className="text-sm text-gray-500">{job.workDurationStart} - {job.workDurationEnd}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.certTitle} className="flex items-center bg-gray-50 p-4 rounded-lg">
                  <img src={cert.imageUrl} alt={cert.certTitle} className="w-12 h-12 object-contain mr-4" />
                  <div>
                    <h4 className="font-semibold">{cert.certTitle}</h4>
                    <p className="text-sm text-gray-600">{cert.certIssuer}</p>
                    <p className="text-xs text-gray-500">{cert.issueDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

