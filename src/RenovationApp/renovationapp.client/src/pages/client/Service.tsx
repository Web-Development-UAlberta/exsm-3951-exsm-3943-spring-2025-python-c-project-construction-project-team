import { useMsal } from "@azure/msal-react";
import { useUploadProjectFile } from "../../api/projects/children/projectFile";
import Form from 'react-bootstrap/Form';
import { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/esm/Button";

const Service = () => {

    const { instance } = useMsal();;
    const uploadMutation = useUploadProjectFile(instance);
    const [files, setFiles] = useState<File[]>([]);
    // Handle file upload
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles([...files, ...Array.from(e.target.files)]);
        }
    };
    const handleFileRemove = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };


    //   uploadProjectFile(projectId, file, fileType, msalInstance),
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log("submit", files[0]);
        await Promise.all(
            files.map(file => uploadMutation.mutateAsync({
                projectId: 1n,
                file,
                fileType: file.type.split('/')[0]
            }))
        );
    }

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <Form.Label className="mb-0">Share floorplans, inspired images, etc.</Form.Label>
                        <div>
                            <Form.Control
                                type="file"
                                id="fileUpload"
                                onChange={handleFileChange}
                                className="d-none"
                                multiple
                            />
                            <label htmlFor="fileUpload" className="btn btn-outline-secondary">
                                Upload Files
                            </label>
                        </div>
                    </div>
                    {files && files.length > 0 && (
                        <ul className="mt-2 list-group">
                            {files.map((file, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    {file.name}
                                    <Button variant="outline-danger" size="sm" onClick={() => handleFileRemove(index)}>
                                        <i className="bi bi-trash" ></i>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                    {files && files.length > 0 && (
                        <div className="mt-2">
                            <small className="text-muted">
                                {files.length} file(s) selected
                            </small>
                        </div>
                    )}
                </Form.Group>
                <Button
                    variant="dark"
                    type="submit"
                    className="py-2"
                >
                    Submit Request
                </Button>
            </Form>

            <h1 className="gallery-title text-center mb-2">Services</h1>
            {/* Kitchen Remodels */}
            <h2>Kitchen Remodels</h2>
            <h3>What’s Included in a Kitchen Renovation</h3>
            <p>The goal of any kitchen renovation in Calgary is to improve the look and aesthetic of one of the most important rooms in the house. We help you carefully select the best finishings, hardware, layouts, and upgrades. During the planning phase, our designers will work with you to understand your vision for the project. We can replace your cupboards with custom-made MDF or natural wood cabinets and install new flooring, lighting, backsplash, butcher blocks, countertops, and more.</p>
            <ul>
                <li>Custom Cabinetry</li>
                <li>Upgraded Appliances</li>
                <li>New Flooring & Backsplash</li>
                <li>Changing Space Layout</li>
            </ul>
            <h3>Why You Should Invest in a Kitchen Renovation</h3>
            <p>Congratulations! You’ve decided to invest in the most important room in your house! Like bathroom renovations in Calgary, remodelling your kitchen offers several benefits, including an increase in your home’s value and an overall improvement in your quality of life. Whether you’re planning to sell or enjoy your home for years to come, we don’t recommend taking shortcuts when it comes to kitchen renos. Trust us; you’ll be happier with quartz countertops, new appliances, and custom cabinets.</p>


            {/* Bathroom Renovations */}
            <h2>Bathroom Renovations</h2>
            <h3>What’s Included in a Bathroom Renovation in Calgary?</h3>
            <p>Our goal is to help you see the full potential of every room in your house, including the toilet. Together, we can explore the possibilities of heated floors, steam generators, towel dryers, smart technology integration, lighted mirrors, and custom vanities. In addition to adding new features, our architectural and interior designers work together to determine a cohesive use of space that’s both intuitive and attractive. Our designers are experts at incorporating the latest trends, including floating shower benches, soaker tubs, rain showers, custom cabinets, and more.</p>
            <ul>
                <li>Showers, Tubs, Sinks, & Toilets</li>
                <li>Upgraded Lighting, Mirrors & Windows</li>
                <li>Custom Vanities & Built-In Storage</li>
                <li>Customized Tile Design & Flooring</li>
            </ul>
            <h3>Why Invest in a New Bathroom?</h3>
            <p>It’s amazing how much a bathroom remodel in Calgary can change your life, from improving home organization to introducing greater comfort and harmony. We maintain an intentional and design-led approach with all projects, and we guarantee bathroom renovations that will contribute to the intrinsic value of your home. Save money with energy-efficient fixtures, save time with custom dual vanities, and save yourself from the stress of daily life.</p>


            {/* Basement Finishings */}
            <h2>Basement Finishings</h2>
            <h3>What’s Included in a Basement Development in Calgary?</h3>
            <p>Basement renovations can vary in complexity, but we aim to deliver beautiful, quality results every time. Whether we’re developing or renovating a previously developed space, we’ll consider everything from the layout and design to the electrical, plumbing, and HVAC and any necessary permits. We can also incorporate features such as custom built-in cabinets, heated flooring, wood or gas fireplaces, or specialty wiring for surround systems and other entertainment needs.</p>
            <ul>
                <li>Prepping and Framing</li>
                <li>Necessary Building Permits</li>
                <li>Electrical, Plumbing & HVAC</li>
                <li>Architectural & Interior Design</li>
            </ul>
            <h3>Why Develop Your Basement?</h3>
            <p>Did you know that a basement development in Calgary can increase your living space by 30-50%? Potential homebuyers frequently consider total livable square footage, upstairs and downstairs, when deciding if a home is right for them. Plus, most families love the idea of a move-in ready house. In addition to being attractive for buyers, a fully finished house opens up a world of possibilities for you and your family from a custom man cave to children’s playrooms and home office space to a complete home theatre.</p>


            {/* Home Additions */}

            <h2 id="additions">Home Additions</h2>
            <h3>What’s Included in a Home Addition in Calgary?</h3>
            <p>What’s included in a home addition in Calgary will range greatly depending on the space you’re creating and where that space is relative to the rest of your home. At a minimum, you can probably expect to account for a few new windows, new siding, and the extension or creation of a roofline. This will likely trigger a new soffit, fascia, and an extension of your gutter system. It’s not uncommon for home additions to start a general renovation or update your home’s exterior since the addition of these materials can either be matched to the existing facade or set the trend for your home’s new look. Of course, you’ll then be looking to finish the inside of the space with new flooring, electrical, HVAC, and in some cases, cabinetry and plumbing to integrate it with the rest of your home.</p>
            <ul>
                <li>Exterior Tie-In's</li>
                <li>Internal Necessities</li>
                <li>Interior Finishes</li>
            </ul>
            <h3>Why You Should Invest in a Home Addition in Calgary?</h3>
            <p>Home additions in Calgary are a great way to maintain the life you know and love without packing up your life and compromising on another house. They’re an easy way to add value, simply by adding square footage, and they can seriously improve your quality of life at home. With added functional space for work, play, or storage, you’ll be able to enjoy all your home has to offer without sacrificing the space you need to live your best life. Plus, they often boost curb appeal by bringing added emphasis to your home’s facade – front or back!</p>

        </div>
    )
}

export default Service