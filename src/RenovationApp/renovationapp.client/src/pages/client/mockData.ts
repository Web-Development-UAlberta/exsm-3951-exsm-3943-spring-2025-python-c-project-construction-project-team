import Image11 from "../../assets/kitchen-modern-1-1.jpg";
import Image12 from "../../assets/kitchen-modern-1-2.jpg";
import Image13 from "../../assets/kitchen-modern-1-3.jpg";
import Image21 from "../../assets/bathroom-2-1.jpg";
import Image22 from "../../assets/bathroom-2-2.jpg";
import Image23 from "../../assets/bathroom-2-3.jpg";
import Image3 from "../../assets/basement-rustic-3.jpg";
import Image4 from "../../assets/home-additions-4.jpg";
import Image5 from "../../assets/kitchen-rustic-5.jpg";
import Image6 from "../../assets/bathroom-6.jpg";
import Image7 from "../../assets/basements-shpisticated-7.jpg";
import Image8 from "../../assets/home-additions-8.jpg";
import { ProjectPublicInfoWithImages } from "../../api/projects/project.types";

export const gallery_mock_data: ProjectPublicInfoWithImages[] = [
    {
        "id": 1n,
        "renovationType": "KitchenRemodels",
        "costCategory": 15,
        "renovationTagIds": [
            "Modern"
        ],
        "images": [
            { "url": Image11, fileName: "", fileType: "image" },
            { "url": Image12, fileName: "", fileType: "image" },
            { "url": Image13, fileName: "", fileType: "image" },
        ]
    },
    {
        "id": 2n,
        "renovationType": "BathroomRenovations",
        "costCategory": 10,
        "renovationTagIds": [
            "Modern",
            "Rustic"
        ],
        "images": [
            { "url": Image21, fileName: "", fileType: "image" },
            { "url": Image22, fileName: "", fileType: "image" },
            { "url": Image23, fileName: "", fileType: "image" },
        ]
    },
    {
        "id": 3n,
        "renovationType": "BasementFinishing",
        "costCategory": 20,
        "renovationTagIds": [
            "Rustic",
            "Sophisticated"
        ],
        "images": [{ "url": Image3, fileName: "", fileType: "image" }]
    },
    {
        "id": 4n,
        "renovationType": "HomeAdditions",
        "costCategory": 45,
        "renovationTagIds": [
            "Modern",
            "Sophisticated"
        ],
        "images": [{ "url": Image4, fileName: "", fileType: "image" }]
    },
    {
        "id": 5n,
        "renovationType": "KitchenRemodels",
        "costCategory": 13,
        "renovationTagIds": [
            "Rustic"
        ],
        "images": [{ "url": Image5, fileName: "", fileType: "image" }]
    },
    {
        "id": 6n,
        "renovationType": "BathroomRenovations",
        "costCategory": 9,
        "renovationTagIds": [
            "Modern",
            "Rustic",
            "Sophisticated"
        ],
        "images": [{ "url": Image6, fileName: "", fileType: "image" }]
    },
    {
        "id": 7n,
        "renovationType": "BasementFinishing",
        "costCategory": 18,
        "renovationTagIds": [
            "Sophisticated"
        ],
        "images": [{ "url": Image7, fileName: "", fileType: "image" }]
    },
    {
        "id": 8n,
        "renovationType": "HomeAdditions",
        "costCategory": 40,
        "renovationTagIds": [
            "Modern",
            "Rustic"
        ],
        "images": [{ "url": Image8, fileName: "", fileType: "image" }]
    }
]