import React, { useState } from 'react';
import studioImage from './studio.jpeg';
import oneBedroomImage from './1br.jpeg';
import twoBedroomImage from './2br.jpeg';


const navbarHeight = '75px';


const contentStyle = {
    position: 'fixed',
    top: navbarHeight,
    bottom: '0',
    left: '0',
    right: '0',
    maxHeight: `calc(100vh - ${navbarHeight})`,
    overflowY: 'auto',
    margin: '0',
    padding: '20px',
    background: '#fff',
    zIndex: 999
};


const Rooms = () => {
    const [showImageOverlay, setShowImageOverlay] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);


    const rooms = [
        {
            type: 'Studio Type',
            image: studioImage,
            details: 'Cozy studio apartment with a combined living area and bedroom, perfect for individuals or couples.',
            area: '22 sqm ±',
            price: '3.38 Mn',
            floorPlanDetails: 'Floor plan details for Studio Type',
            tour3D: ['https://tours.exsight360.com/filinvest/futura/index.html?fbclid=IwAR0_yS0EJcnCyZsL8GpIUctFArPt9rzePvfVW69W7ev8V64nGmaDoP8TNX0_aem_AXRJ5OKziaebAmcE71-259AuKGFxIYcsq3agPjbruFZZZwPWIvnHksa-trQ5vUyrcfvJOD78sF_eWZ6Hbv_NZq31']
        },
        {
            type: '1BR unit',
            image: oneBedroomImage,
            details: 'Spacious one-bedroom apartment with separate living and sleeping areas, ideal for small families or individuals who desire more space.',
            area: '28 sqm ±',
            price: '4.35 Mn',
            floorPlanDetails: 'Floor plan details for 1BR unit',
        },
        {
            type: '2BR Unit',
            image: twoBedroomImage,
            details: 'Comfortable two-bedroom apartment with ample space for families or groups of friends, featuring separate bedrooms and a shared living area.',
            area: '32 sqm ±',
            price: '4.74 Mn',
            floorPlanDetails: 'Floor plan details for 2BR unit',
            tour3D: ['https://my.matterport.com/show/?m=bwASYWhzkkg&fbclid=IwAR1uQ6My3Wg_i2U28R9j-zD9cxIX71KHtlUTjWM1ZEPbNWdV4LalzJXVy-4_aem_AXT_uHGg1HzIne9U4O1h7TXT70Kxts34ofvNX1eovmeW4LsyilOTgKkag4uaSXguQHV8MFKXphY_K-eIrAspxYn', 'https://my.matterport.com/show/?m=mC9JxUAZ6Ei&fbclid=IwAR28CsDtcMFyn40p-ZxOqMrDbzNGJS1y10I6z8Aeodz-I34UERxGC52tU_k_aem_AXTLjZpqCcKxAXrJx1-tEZdiJzYbo2ROTa7A1ndUFiokTBkkvbzFO6REUcZb5LsyilOTgKkag4uaSXguQHV8MFKXphY_K-eIrAspxYn']
        },
    ];


    const openImageOverlay = (room) => {
        setSelectedRoom(room);
        setShowImageOverlay(true);
    };


    const closeImageOverlay = () => {
        setShowImageOverlay(false);
    };


    return (
        <div style={{ fontFamily: 'Verdana, sans-serif', ...contentStyle }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '30px' }}>Units Available</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {rooms.map((room, index) => (
                    <div key={room.type} style={{ width: '30%', margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', fontSize: '18px', color: '#333' }}>
                        <h3>{room.type}</h3>
                        <img
                            src={room.image}
                            alt={room.type}
                            style={{ width: '100%', height: '200px', objectFit: 'cover', cursor: 'pointer', borderRadius: '8px' }}
                            onClick={() => openImageOverlay(room)}
                        />
                        <p>{room.details}</p>
                        <p style={{ fontSize: '14px' }}>Click the image to see details of the floor plan</p>
                    </div>
                ))}
            </div>


            {showImageOverlay && selectedRoom && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 999, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ maxWidth: '90%', maxHeight: '90%', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
                        <img
                            src={selectedRoom.image}
                            alt={selectedRoom.type}
                            style={{ width: '100%', marginBottom: '20px', borderRadius: '8px' }}
                        />
                        <h2 style={{ fontSize: '24px', color: '#333' }}>{selectedRoom.type}</h2>
                        <p>{selectedRoom.details}</p>
                        <p>Area: {selectedRoom.area}</p>
                        <p>Average Price: {selectedRoom.price}</p>
                        {selectedRoom.tour3D && (
                            <div style={{ marginTop: '20px' }}>
                                <h3 style={{ fontSize: '20px', color: '#333' }}>3D Tours</h3>
                                {selectedRoom.tour3D.map((tour, idx) => (
                                    <iframe
                                        key={idx}
                                        title={`3D Tour ${idx}`}
                                        src={tour}
                                        style={{ width: '100%', height: '400px', border: 'none', marginBottom: '10px' }}
                                    ></iframe>
                                ))}
                            </div>
                        )}
                        <button onClick={closeImageOverlay} style={{ backgroundColor: '#CA3433', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}>Close</button>
                    </div>
                </div>
            )}


            <div style={{ marginTop: '50px', borderTop: '1px solid #ccc', paddingTop: '20px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '24px', color: '#333' }}>3D Tours</h2>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {rooms.map((room, index) => (
                        <div key={room.type + index} style={{ margin: '10px' }}>
                            {Array.isArray(room.tour3D) && room.tour3D.length > 0 && room.tour3D.map((tour, idx) => (
                                <iframe
                                    key={idx}
                                    title={'3D Tour ' + idx}
                                    src={tour}
                                    style={{ width: '800px', height: '600px', border: 'none', marginBottom: '10px' }}
                                ></iframe>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default Rooms;





