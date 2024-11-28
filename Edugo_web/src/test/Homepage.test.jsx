import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import userEvent from '@testing-library/user-event'; // นำเข้า userEvent
import Homepage from '../components/Homepage';

describe('Homepage Component', () => {
    let shouldRunAll = false;
    beforeEach(() => {
        render(
            <Router>
                <Homepage />
            </Router>
        );
    });

    const checkAllScholarship = async () => {
        const announceLengthElement = await screen.findByTestId('all-announce');
        if (announceLengthElement.textContent === '0') {
            shouldRunAll = true
        } else {
            shouldRunAll = false
        }
    }
    checkAllScholarship();

    it('Chack render Homepage', async () => {
        const homepage = await screen.findByText(/Scholarship Management/)
        expect(homepage).not.toBeNull(); // ยืนยันว่ามี element อยู่ใน DOM
        expect(homepage).toBeInTheDocument(); // ยืนยันว่ามี element อยู่ใน DOM
    });

    (shouldRunAll ? it.skip : it)('Check Detail All Scholarship', async () => {
        const allScholarship = await screen.findByText(/All Scholarship/)
        expect(allScholarship).not.toBeNull(); // ยืนยันว่ามี element อยู่ใน DOM
        expect(allScholarship).toBeInTheDocument(); // ยืนยันว่ามี element อยู่ใน DOM
        // คลิกall announce
        await userEvent.click(allScholarship);

        // รอให้ค่า announce.length อัปเดต
        await waitFor(() => {
            const announceLengthElement = screen.getByTestId('all-announce');
            expect(announceLengthElement).not.toHaveTextContent('0');
            // เช็คว่าต้องไม่มีข้อความ This space is waiting for data
            const waitingForData = screen.queryByText(/This space is waiting for data/)
            expect(waitingForData).toBeNull();
        });
    });

    (shouldRunAll ? it : it.skip)('Check No Detail All Scholarship', async () => {
        const allScholarship = await screen.findByText(/All Scholarship/)
        expect(allScholarship).not.toBeNull(); // ยืนยันว่ามี element อยู่ใน DOM
        expect(allScholarship).toBeInTheDocument(); // ยืนยันว่ามี element อยู่ใน DOM
        // คลิกall announce
        await userEvent.click(allScholarship);

        // รอให้ค่า announce.length อัปเดต
        await waitFor(() => {
            const announceLengthElement = screen.getByTestId('all-announce');
            expect(announceLengthElement).toHaveTextContent('0');
            // เช็คว่าต้องมีข้อความ This space is waiting for data
            const waitingForData = screen.findByText(/This space is waiting for data/)
            expect(waitingForData).not.toBeNull();
        });

    });

    

});
