import React, { useEffect, useRef, useState } from 'react';
import { Mail, MapPin, Code, Briefcase, Award, Heart, ChevronRight, Terminal } from 'lucide-react';

export const AboutPage: React.FC = () => {
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    const identity = {
        firstName: "Cooper",
        lastName: "Wallace",
        country: "USA",
        occupation: "Lead Cloud Security Engineer",
        hobbies: ["Consulting", "Start-ups", "Hiking", "Gym", "Cooking", "Philosophy"],
        email: "cooper@lariatlabs.dev",
        skills: [
            "Kubernetes", "React", "DevSecOps", "Javascript", "Python", "Golang",
            "Rust", "Bash scripting", "Full-Stack Development", "CI/CD Pipelines",
            "SAST/DAST tooling", "Application Security", "Code reviews", "SCA", "AWS", "GCP",
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
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ics2.png", certTitle: "Systems Security Certified Practitioner (SSCP)", certIssuer: "ISC2", issueDate: "Aug 2022" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/elearn.png", certTitle: "eWPTX", certIssuer: "eLearnSecurity", issueDate: "Jul 2024" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ec_c_logo.png", certTitle: "Certified Ethical Hacker (CEH)", certIssuer: "EC-Council", issueDate: "Jun 2021" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/ec_c_logo.png", certTitle: "Certified Encryption Specialist (ECES)", certIssuer: "EC-Council", issueDate: "Jan 2022" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png", certTitle: "Security+", certIssuer: "CompTIA", issueDate: "Mar 2020" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png", certTitle: "CySA+", certIssuer: "CompTIA", issueDate: "May 2020" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png", certTitle: "Network+", certIssuer: "CompTIA", issueDate: "Mar 2021" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png", certTitle: "Project+", certIssuer: "CompTIA", issueDate: "Jul 2022" },
        { imageUrl: "https://blog-photo-bucket.s3.amazonaws.com/AboutMe/comptiaLogo.png", certTitle: "PenTest+", certIssuer: "CompTIA", issueDate: "Feb 2023" },
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
        return () => { setTerminalLines([]); };
    }, []);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLines]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">About</h1>
                <p className="text-sm text-muted-foreground">{identity.occupation}</p>
            </div>

            {/* Terminal */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border bg-muted/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted-foreground font-mono">terminal</span>
                </div>
                <div
                    ref={terminalRef}
                    className="font-mono text-sm p-4 h-36 overflow-y-auto space-y-1"
                >
                    {terminalLines.map((line, i) => (
                        <div
                            key={i}
                            className={line.startsWith('$') ? 'text-primary' : 'text-muted-foreground'}
                        >
                            {line}
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="md:flex gap-8 p-6 items-start">
                    <div className="flex-none md:w-48 mb-6 md:mb-0">
                        <img
                            src="/me.jpg"
                            alt="Cooper Wallace"
                            className="w-full aspect-square object-cover rounded-lg"
                        />
                    </div>
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded border border-primary/20">
                                <Terminal className="w-3 h-3" />
                                {identity.occupation}
                            </span>
                            <h2 className="text-2xl font-bold text-foreground">
                                {identity.firstName} {identity.lastName}
                            </h2>
                        </div>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 flex-none" />
                                {identity.country}
                            </p>
                            <p className="flex items-center gap-2">
                                <Mail className="w-4 h-4 flex-none" />
                                <a href={`mailto:${identity.email}`} className="text-primary hover:text-primary/80 transition-colors">
                                    {identity.email}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border-t border-border p-6 space-y-10">
                    {/* Skills */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {identity.skills.map(skill => (
                                <span
                                    key={skill}
                                    className="px-2.5 py-1 text-xs rounded border border-border bg-secondary text-secondary-foreground hover:border-primary/30 hover:text-foreground transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>

                    {/* Hobbies */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Hobbies</h3>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {identity.hobbies.map(hobby => (
                                <div key={hobby} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <ChevronRight className="w-3.5 h-3.5 text-primary flex-none" />
                                    {hobby}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Experience */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Experience</h3>
                        </div>
                        <div className="space-y-3">
                            {experience.map(job => (
                                <div
                                    key={job.companyName}
                                    className="flex gap-4 p-4 rounded-lg border border-border bg-background hover:border-border/80 transition-colors"
                                >
                                    <div className="flex-none w-12 h-12 rounded overflow-hidden bg-muted flex items-center justify-center">
                                        <img
                                            src={job.imageUrl}
                                            alt={job.companyName}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="text-sm font-medium text-foreground">{job.title}</h4>
                                        <p className="text-sm text-primary">{job.companyName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {job.workDurationStart} — {job.workDurationEnd}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Certifications */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-muted-foreground" />
                            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">Certifications</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {certifications.map(cert => (
                                <div
                                    key={cert.certTitle}
                                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                                >
                                    <div className="flex-none w-10 h-10 overflow-hidden">
                                        <img
                                            src={cert.imageUrl}
                                            alt={cert.certTitle}
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <h4 className="text-xs font-medium text-foreground line-clamp-2">{cert.certTitle}</h4>
                                        <p className="text-xs text-primary">{cert.certIssuer}</p>
                                        <p className="text-xs text-muted-foreground">{cert.issueDate}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};
