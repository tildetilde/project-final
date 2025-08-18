// src/pages/DesignSystem.tsx
import { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Heading,
  DotPattern,
} from "../ui";
import { Link } from "react-router-dom";
import BanganzaIntro from "../components/BanganzaIntro";

export const DesignSystem = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="min-h-screen bg-background p-8 overflow-x-hidden">
      {!introDone && <BanganzaIntro onFinish={() => setIntroDone(true)} />}

      <div
        aria-hidden={!introDone}
        className={introDone ? "opacity-100" : "opacity-0"}
      >
        <div className="max-w-6xl mx-auto space-y-12">
          <section className="text-center space-y-6">
            <Heading level={1} className="text-8xl">
              DESIGN SYSTEM
            </Heading>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive design system built with our brand colors and Zen
              Kaku Gothic New typography.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/gamemode">
                <Button variant="primary" size="lg">
                  Get Started
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </section>

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
                      INFO BLOCK
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
                      MORE INFO
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
                      EVEN MORE
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
                      SO MUCH INFO
                    </Heading>
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
          </section>

          <section className="space-y-6">
            <Heading level={3}>Button Variants</Heading>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
          </section>

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
    </div>
  );
};
