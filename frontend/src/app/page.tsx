import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { DotPattern } from "@/components/ui/dot-pattern";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <Heading level={1} className="text-8xl">
            DESIGN SYSTEM
          </Heading>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive design system built with your brand colors and Zen
            Kaku Gothic New typography.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="primary" size="lg">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </section>

        {/* Component Examples */}
        <section className="space-y-8">
          <Heading level={2}>Component Examples</Heading>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hoverable>
              <CardHeader>
                <DotPattern variant="diamond" size="md" />
                <CardContent>
                  <Heading
                    level={5}
                    className="text-primary font-medium tracking-wide"
                  >
                    UPDATES
                  </Heading>
                </CardContent>
              </CardHeader>
            </Card>

            <Card hoverable>
              <CardHeader>
                <DotPattern variant="square" size="md" />
                <CardContent>
                  <Heading
                    level={5}
                    className="text-primary font-medium tracking-wide"
                  >
                    NO CODE
                  </Heading>
                </CardContent>
              </CardHeader>
            </Card>

            <Card hoverable>
              <CardHeader>
                <DotPattern variant="cluster" size="md" />
                <CardContent>
                  <Heading
                    level={5}
                    className="text-primary font-medium tracking-wide"
                  >
                    STUDENTS WORKS
                  </Heading>
                </CardContent>
              </CardHeader>
            </Card>

            <Card hoverable>
              <CardHeader>
                <DotPattern variant="diagonal" size="md" />
                <CardContent>
                  <Heading
                    level={5}
                    className="text-primary font-medium tracking-wide"
                  >
                    NEW MEMBERS
                  </Heading>
                </CardContent>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Button Variants */}
        <section className="space-y-6">
          <Heading level={3}>Button Variants</Heading>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
        </section>

        {/* Typography Scale */}
        <section className="space-y-6">
          <Heading level={3}>Typography Scale</Heading>
          <div className="space-y-4">
            <Heading level={1}>Heading 1 - Display</Heading>
            <Heading level={2}>Heading 2 - Page Title</Heading>
            <Heading level={3}>Heading 3 - Section</Heading>
            <Heading level={4}>Heading 4 - Subsection</Heading>
            <Heading level={5}>Heading 5 - Component</Heading>
            <Heading level={6}>Heading 6 - Label</Heading>
            <p className="text-base text-foreground">
              Body text - Regular paragraph content
            </p>
            <p className="text-sm text-muted-foreground">
              Small text - Secondary information
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
