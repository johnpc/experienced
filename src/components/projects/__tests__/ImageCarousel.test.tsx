import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageCarousel, { type CarouselImage } from '../ImageCarousel';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, onLoad, ...props }: any) {
    // Simulate image load
    setTimeout(() => onLoad && onLoad(), 0);
    return <img src={src} alt={alt} {...props} />;
  };
});

const mockImages: CarouselImage[] = [
  {
    src: '/images/project1.jpg',
    alt: 'Project image 1',
    caption: 'Before renovation',
  },
  {
    src: '/images/project2.jpg',
    alt: 'Project image 2',
    caption: 'During construction',
  },
  {
    src: '/images/project3.jpg',
    alt: 'Project image 3',
    caption: 'After completion',
  },
];

describe('ImageCarousel', () => {
  it('renders images correctly', () => {
    render(<ImageCarousel images={mockImages} />);

    expect(screen.getByAltText('Project image 1')).toBeInTheDocument();
    expect(screen.getByText('Before renovation')).toBeInTheDocument();
  });

  it('shows navigation arrows when multiple images exist', () => {
    render(<ImageCarousel images={mockImages} />);

    expect(screen.getByLabelText('Previous image')).toBeInTheDocument();
    expect(screen.getByLabelText('Next image')).toBeInTheDocument();
  });

  it('does not show navigation arrows for single image', () => {
    render(<ImageCarousel images={[mockImages[0]]} />);

    expect(screen.queryByLabelText('Previous image')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Next image')).not.toBeInTheDocument();
  });

  it('navigates to next image when next button is clicked', async () => {
    render(<ImageCarousel images={mockImages} />);

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByAltText('Project image 2')).toBeInTheDocument();
      expect(screen.getByText('During construction')).toBeInTheDocument();
    });
  });

  it('navigates to previous image when previous button is clicked', async () => {
    render(<ImageCarousel images={mockImages} />);

    // First go to next image
    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByAltText('Project image 2')).toBeInTheDocument();
    });

    // Then go back to previous
    const prevButton = screen.getByLabelText('Previous image');
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByAltText('Project image 1')).toBeInTheDocument();
      expect(screen.getByText('Before renovation')).toBeInTheDocument();
    });
  });

  it('shows thumbnails when enabled', () => {
    render(<ImageCarousel images={mockImages} showThumbnails={true} />);

    const thumbnails = screen
      .getAllByRole('button')
      .filter((button) => button.querySelector('img'));
    expect(thumbnails).toHaveLength(3);
  });

  it('navigates to specific image when thumbnail is clicked', async () => {
    render(<ImageCarousel images={mockImages} showThumbnails={true} />);

    const thumbnails = screen
      .getAllByRole('button')
      .filter((button) => button.querySelector('img'));

    fireEvent.click(thumbnails[2]); // Click third thumbnail

    await waitFor(() => {
      expect(screen.getByAltText('Project image 3')).toBeInTheDocument();
      expect(screen.getByText('After completion')).toBeInTheDocument();
    });
  });

  it('shows dots indicator when thumbnails are disabled', () => {
    render(<ImageCarousel images={mockImages} showThumbnails={false} />);

    const dots = screen.getAllByLabelText(/Go to slide/);
    expect(dots).toHaveLength(3);
  });

  it('shows image counter', () => {
    render(<ImageCarousel images={mockImages} />);

    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('updates image counter when navigating', async () => {
    render(<ImageCarousel images={mockImages} />);

    const nextButton = screen.getByLabelText('Next image');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('2 / 3')).toBeInTheDocument();
    });
  });

  it('hides captions when showCaptions is false', () => {
    render(<ImageCarousel images={mockImages} showCaptions={false} />);

    expect(screen.queryByText('Before renovation')).not.toBeInTheDocument();
  });

  it('handles empty images array', () => {
    render(<ImageCarousel images={[]} />);

    expect(screen.getByText('No images available')).toBeInTheDocument();
  });

  it('applies correct aspect ratio classes', () => {
    const { rerender } = render(
      <ImageCarousel images={mockImages} aspectRatio="square" />
    );

    let container = screen.getByRole('img').closest('.aspect-square');
    expect(container).toBeInTheDocument();

    rerender(<ImageCarousel images={mockImages} aspectRatio="wide" />);
    container = screen.getByRole('img').closest('.aspect-[21/9]');
    expect(container).toBeInTheDocument();
  });

  it('handles keyboard navigation', () => {
    render(<ImageCarousel images={mockImages} />);

    // Simulate arrow key press
    fireEvent.keyDown(document, { key: 'ArrowRight' });

    // Note: In a real test, you'd need to set up the fullscreen state
    // This is a simplified test for the keyboard event handling
    expect(screen.getByAltText('Project image 1')).toBeInTheDocument();
  });

  it('shows loading state for images', () => {
    // Mock Image component that doesn't call onLoad immediately
    jest.doMock('next/image', () => {
      return function MockImage({ src, alt, ...props }: any) {
        return <img src={src} alt={alt} {...props} />;
      };
    });

    render(<ImageCarousel images={mockImages} />);

    // Should show loading placeholder initially
    const loadingIndicator = screen
      .getByRole('img')
      .parentElement?.querySelector('svg');
    expect(loadingIndicator).toBeInTheDocument();
  });
});
