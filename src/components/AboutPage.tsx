import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from 'framer-motion';
import { Mail, MapPin, Code, Briefcase, Award, Heart, ChevronRight, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    const identity = {
        firstName: "Cooper",
        lastName: "Wallace",
        country: "USA",
        occupation: "Lead Cloud Security Engineer",
        hobbies: [
            "Consulting",
            "Start-ups",
            "Hiking",
            "Gym",
            "Cooking",
            "Philosophy"
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
            "Application Security",
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

    const commands = [
        "$ whoami",
        `${identity.firstName.toLowerCase()}_${identity.lastName.toLowerCase()}`,
        "$ cat /etc/profile",
        `Role: ${identity.occupation}`,
        `Location: ${identity.country}`,
    ];

    useEffect(() => {
        const typeWriter = async () => {
            for (let i = 0; i < commands.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 300));
                setTerminalLines(prev => [...prev, commands[i]]);
            }
        };

        typeWriter();

        return () => {
            setTerminalLines([]);
        };
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines]);

    return (
        <div className="min-h-screen p-4 md:p-8 relative overflow-hidden bg-gradient-to-br from-background via-background to-background">
            {/* Animated background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000,transparent)]" />

            {/* Cyber orbs */}
            <motion.div
                className="absolute top-20 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [0, 360]
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.3, 0.5, 0.3],
                    rotate: [360, 0]
                }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-8"
            >

                {/* Terminal Card */}
                <Card className="bg-black/90 backdrop-blur-lg border-primary/20 overflow-hidden">
                    <CardHeader className="border-b border-primary/20">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div
                            ref={terminalRef}
                            className="font-mono text-sm h-48 overflow-y-auto space-y-1 text-primary-foreground"
                        >
                            {terminalLines.map((line, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`terminal-line ${line.startsWith('$') ? 'dark:text-primary' : 'dark:text-primary/40 text-secondary/40'} ${line.startsWith('-') ? 'pl-4' : ''}`}
                                >
                                    {line}
                                </motion.div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Main Profile Card */}
                <Card className="bg-background/80 backdrop-blur-lg border-primary/20 overflow-hidden">
                    <CardHeader className="md:flex gap-8 p-4 items-center">
                        <div className="relative md:w-[400px] aspect-square overflow-hidden">
                            <motion.img
                                src="/me.jpg"
                                alt="Cooper Wallace"
                                className="w-full h-full object-cover rounded-lg"
                                transition={{ duration: 0.5 }}
                            />
                            <div className="absolute inset-0" />
                        </div>
                        <div className="p-8 space-y-4">
                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                                    <Terminal className="w-4 h-4 mr-2" />
                                    {identity.occupation}
                                </Badge>
                                <CardTitle className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary animate-gradient">
                                    {identity.firstName} {identity.lastName}
                                </CardTitle>
                            </motion.div>

                            <motion.div
                                className="space-y-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
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
                        {/* Skills Section with Animated Grid */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Code className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Skills</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {identity.skills.map((skill, index) => (
                                    <motion.div
                                        key={skill}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        className="group"
                                    >
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 hover:bg-primary/10 transition-all duration-300">
                                            <p className="text-sm font-medium text-primary group-hover:text-primary-foreground">
                                                {skill}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Hobbies Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Heart className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Hobbies</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {identity.hobbies.map((hobby, index) => (
                                    <motion.div
                                        key={hobby}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center gap-2 text-muted-foreground group"
                                        whileHover={{ x: 5 }}
                                    >
                                        <ChevronRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                        <span className="group-hover:text-primary transition-colors">{hobby}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Experience Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Experience</h2>
                            </div>
                            <div className="grid gap-6">
                                {experience.map((job, index) => (
                                    <motion.div
                                        key={job.companyName}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        className="group"
                                    >
                                        <div className="flex gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300">
                                            <div className="relative w-16 h-16 overflow-hidden rounded-md">
                                                <motion.img
                                                    src={job.imageUrl}
                                                    alt={job.companyName}
                                                    className="w-full h-full object-contain"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-primary">{job.companyName}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {job.workDurationStart} - {job.workDurationEnd}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>

                        {/* Certifications Section */}
                        <motion.section
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-2">
                                <Award className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Certifications</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {certifications.map((cert, index) => (
                                    <motion.div
                                        key={cert.certTitle}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group"
                                    >
                                        <div className="flex items-center gap-4 p-4 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300">
                                            <div className="relative w-12 h-12 overflow-hidden">
                                                <motion.img
                                                    src={cert.imageUrl}
                                                    alt={cert.certTitle}
                                                    className="w-full h-full object-contain"
                                                    whileHover={{ scale: 1.1 }}
                                                    transition={{ duration: 0.3 }}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="font-semibold group-hover:text-primary transition-colors">
                                                    {cert.certTitle}
                                                </h4>
                                                <p className="text-sm text-primary">{cert.certIssuer}</p>
                                                <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};
