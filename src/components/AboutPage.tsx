import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Binary, Mail, MapPin, Code, Briefcase, Award, Heart, ChevronRight } from 'lucide-react';


export const AboutPage: React.FC = () => {
    const identity = {
        firstName: "Cooper",
        lastName: "Wallace",
        country: "USA",
        occupation: "Lead Cloud Security Engineer",
        hobbies: [
            "Hiking",
            "Gym",
            "Full-stack development",
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden">
            {/* Cyber background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <motion.div
                    className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 right-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto space-y-8"
            >
                {/* Profile Card */}
                <motion.div variants={itemVariants}>
                    <Card className="bg-background/50 backdrop-blur-lg border-primary/10 overflow-hidden">
                        <CardHeader className="md:flex gap-8 p-4">
                            <div className="relative md:w-[300px] aspect-square overflow-hidden">
                                <motion.img
                                    src="/public/me.jpg"
                                    alt="Cooper Wallace"
                                    className="w-full object-cover"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.5 }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-50" />
                            </div>
                            <div className="p-8 space-y-4">
                                <motion.div
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                                        {identity.occupation}
                                    </Badge>
                                    <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
                                        {identity.firstName} {identity.lastName}
                                    </CardTitle>
                                </motion.div>

                                <motion.div
                                    className="space-y-2"
                                    variants={itemVariants}
                                >
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        {identity.country}
                                    </p>
                                    <p className="flex items-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" />
                                        <a href={`mailto:${identity.email}`} className="text-primary hover:text-primary/80 transition-colors">
                                            {identity.email}
                                        </a>
                                    </p>
                                </motion.div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 space-y-12">
                            {/* About Section */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Binary className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">About Me</h2>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    I have a strong passion for Cybersecurity and application development, both stemming from my love of programming.
                                    I constantly strive to learn new things and am always looking for new challenges.
                                </p>
                            </motion.section>

                            {/* Skills Section */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Code className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Skills</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {identity.skills.map((skill) => (
                                        <motion.div
                                            key={skill}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Badge
                                                variant="secondary"
                                                className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {skill}
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Hobbies Section */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Hobbies</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {identity.hobbies.map((hobby) => (
                                        <motion.div
                                            key={hobby}
                                            className="flex items-center gap-2 text-muted-foreground"
                                            whileHover={{ x: 5 }}
                                        >
                                            <ChevronRight className="w-4 h-4 text-primary" />
                                            {hobby}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Experience Section */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Experience</h2>
                                </div>
                                <div className="grid gap-6">
                                    {experience.map((job) => (
                                        <motion.div
                                            key={job.companyName}
                                            className="flex gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={job.imageUrl}
                                                alt={job.companyName}
                                                className="w-16 h-16 object-contain"
                                            />
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-lg">{job.title}</h3>
                                                <p className="text-primary">{job.companyName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {job.workDurationStart} - {job.workDurationEnd}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Certifications Section */}
                            <motion.section variants={itemVariants} className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Award className="w-6 h-6 text-primary" />
                                    <h2 className="text-2xl font-bold">Certifications</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {certifications.map((cert) => (
                                        <motion.div
                                            key={cert.certTitle}
                                            className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <img
                                                src={cert.imageUrl}
                                                alt={cert.certTitle}
                                                className="w-12 h-12 object-contain"
                                            />
                                            <div className="space-y-1">
                                                <h4 className="font-semibold">{cert.certTitle}</h4>
                                                <p className="text-sm text-primary">{cert.certIssuer}</p>
                                                <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
};
