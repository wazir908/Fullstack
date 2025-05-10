import React, { useEffect, useState } from 'react';

export default function Promotions() {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const res = await fetch('https://crm-backend-8e1q.onrender.com/api/employees');
      const data = await res.json();
      const now = new Date();

      const filtered = data.filter(emp => {
        if (!emp.startDate) return false;
        const hireDate = new Date(emp.startDate);
        const promotionDate = new Date(hireDate);
        promotionDate.setMonth(hireDate.getMonth() + 11);
        const diff = promotionDate - now;
        return diff >= 0 && diff <= 30 * 24 * 60 * 60 * 1000; // next 30 days
      });

      setPromotions(filtered);
    } catch (error) {
      console.error('Failed to fetch promotion data:', error);
    }
  };

  return (
    <div className="promotion-page">
      <h2>Upcoming Promotion Reviews</h2>
      {promotions.length === 0 ? (
        <p>No upcoming promotions in the next 30 days.</p>
      ) : (
        <table className="promotion-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Client</th>
              <th>Start Date</th>
              <th>Promotion Review Date</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((emp, index) => {
              const hireDate = new Date(emp.startDate);
              const promoDate = new Date(hireDate);
              promoDate.setMonth(hireDate.getMonth() + 11);

              return (
                <tr key={index}>
                  <td>{emp.name}</td>
                  <td>{emp.client}</td>
                  <td>{hireDate.toLocaleDateString()}</td>
                  <td>{promoDate.toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}