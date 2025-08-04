import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProjectGallery, { type Project } from '../ProjectGallery';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

const mockProjects: Project[] = [
  {
    id: 'kitchen-remodel',
    title: 'Modern Kitchen Remodel',
    description: 'A stunning kitchen transformation with custom cabinets.',
    category: 'Kitchen',
    images: [
      {
        src: '/images/kitchen1.jpg',
        alt: 'Modern kitchen',
        caption: 'After renovation',
      },
    ],
    completedAt: '2024-01-15',
    featured: true,
    slug: 'kitchen-remodel',
  },
  {
    id: 'bathroom-renovation',
    title: 'Luxury Bathroom Renovation',
    description: 'Spa-like bathroom with premium finishes.',
    category: 'Bathroom',
    images: [
      {
        src: '/images/bathroom1.jpg',
        alt: 'Luxury bathroom',
        caption: 'Completed renovation',
      },
    ],
    completedAt: '2024-02-01',
    featured: false,
    slug: 'bathroom-renovation',
  },
  {
    id: 'home-addition',
    title: 'Family Room Addition',
    description: 'Spacious addition with vaulted ceilings.',
    category: 'Addition',
    images: [
      {
        src: '/images/addition1.jpg',
        alt: 'Family room addition',
        caption: 'New family space',
      },
    ],
    completedAt: '2024-03-01',
    featured: true,
    slug: 'home-addition',
  },
];

describe('ProjectGallery', () => {
  it('renders projects correctly', () => {
    render(<ProjectGallery projects={mockProjects} />);

    expect(screen.getByText('Modern Kitchen Remodel')).toBeInTheDocument();
    expect(screen.getByText('Luxury Bathroom Renovation')).toBeInTheDocument();
    expect(screen.getByText('Family Room Addition')).toBeInTheDocument();
  });

  it('shows category filters when enabled', () => {
    render(<ProjectGallery projects={mockProjects} showFilters={true} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Kitchen')).toBeInTheDocument();
    expect(screen.getByText('Bathroom')).toBeInTheDocument();
    expect(screen.getByText('Addition')).toBeInTheDocument();
  });

  it('filters projects by category', async () => {
    render(<ProjectGallery projects={mockProjects} showFilters={true} />);

    // Click on Kitchen filter
    fireEvent.click(screen.getByText('Kitchen'));

    await waitFor(() => {
      expect(screen.getByText('Modern Kitchen Remodel')).toBeInTheDocument();
      expect(
        screen.queryByText('Luxury Bathroom Renovation')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Family Room Addition')
      ).not.toBeInTheDocument();
    });
  });

  it('shows featured projects first when enabled', () => {
    render(<ProjectGallery projects={mockProjects} showFeaturedFirst={true} />);

    const projectTitles = screen.getAllByRole('heading', { level: 3 });
    expect(projectTitles[0]).toHaveTextContent('Modern Kitchen Remodel'); // Featured
    expect(projectTitles[1]).toHaveTextContent('Family Room Addition'); // Featured
    expect(projectTitles[2]).toHaveTextContent('Luxury Bathroom Renovation'); // Not featured
  });

  it('displays project images with proper alt text', () => {
    render(<ProjectGallery projects={mockProjects} />);

    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('alt', 'Modern kitchen');
    expect(images[1]).toHaveAttribute('alt', 'Luxury bathroom');
    expect(images[2]).toHaveAttribute('alt', 'Family room addition');
  });

  it('shows featured badges for featured projects', () => {
    render(<ProjectGallery projects={mockProjects} />);

    const featuredBadges = screen.getAllByText('Featured');
    expect(featuredBadges).toHaveLength(2); // Two featured projects
  });

  it('displays completion dates', () => {
    render(<ProjectGallery projects={mockProjects} />);

    expect(screen.getByText('Jan 2024')).toBeInTheDocument();
    expect(screen.getByText('Feb 2024')).toBeInTheDocument();
    expect(screen.getByText('Mar 2024')).toBeInTheDocument();
  });

  it('shows image count when multiple images exist', () => {
    const projectWithMultipleImages: Project = {
      ...mockProjects[0],
      images: [
        { src: '/img1.jpg', alt: 'Image 1' },
        { src: '/img2.jpg', alt: 'Image 2' },
        { src: '/img3.jpg', alt: 'Image 3' },
      ],
    };

    render(<ProjectGallery projects={[projectWithMultipleImages]} />);

    expect(screen.getByText('3 photos')).toBeInTheDocument();
  });

  it('handles empty projects array', () => {
    render(<ProjectGallery projects={[]} />);

    expect(screen.getByText('No projects found')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No projects match the selected category. Try selecting a different category.'
      )
    ).toBeInTheDocument();
  });

  it('applies correct grid classes based on gridCols prop', () => {
    const { rerender } = render(
      <ProjectGallery projects={mockProjects} gridCols={2} />
    );

    let gridContainer = screen.getByRole('main').querySelector('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2');

    rerender(<ProjectGallery projects={mockProjects} gridCols={4} />);
    gridContainer = screen.getByRole('main').querySelector('.grid');
    expect(gridContainer).toHaveClass(
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-4'
    );
  });

  it('creates correct project links', () => {
    render(<ProjectGallery projects={mockProjects} />);

    const links = screen.getAllByRole('link');
    const projectLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('/projects/')
    );

    expect(projectLinks[0]).toHaveAttribute(
      'href',
      '/projects/kitchen-remodel'
    );
    expect(projectLinks[1]).toHaveAttribute(
      'href',
      '/projects/bathroom-renovation'
    );
    expect(projectLinks[2]).toHaveAttribute('href', '/projects/home-addition');
  });
});
