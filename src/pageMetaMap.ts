// src/pageMetaMap.ts
export interface PageMetaData {
    url: string;
    bundleEntryPoint: string;
    title: string;
    description: string;
    image?: string;
    type?: string;
    author?: string;
}

export const pages: PageMetaData[] = [
    {
        url: "index.html",
        bundleEntryPoint: "/src/main.tsx",
        title: "Cooper Wallace Blog",
        description: "Engineering insights and technical blog",
        type: "website"
    },
    {
        url: "posts/index.html",
        bundleEntryPoint: "/src/main.tsx",
        title: "Engineering Insights | Cooper Wallace Blog",
        description: "Explore the intersection of innovation and engineering excellence",
        type: "website"
    },
    {
        url: "about/index.html",
        bundleEntryPoint: "/src/main.tsx",
        title: "About | Cooper Wallace Blog",
        description: "Learn more about Cooper Wallace and engineering expertise",
        type: "profile"
    }
];
