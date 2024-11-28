import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Homepage from '../components/Homepage';

describe('Homepage Component', () => {
    beforeEach(() => {
        render(
            <Router>
                <Homepage />
            </Router>
        );
    });

    it('should render Homepage', () => {
        expect(screen.queryByText(/Scholarship Management/)).not.toBeInTheDocument();
    });
});
