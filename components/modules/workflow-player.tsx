"use client";

import React, { useState, useEffect } from "react";
import { WORKFLOWS, WorkflowDefinition, WorkflowStep } from "@/lib/constants/workflows";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface WorkflowPlayerProps {
  initialWorkflowId?: string;
  onStepChange?: (step: WorkflowStep) => void;
  className?: string;
}

export function WorkflowPlayer({
  initialWorkflowId = "golden-path",
  onStepChange,
  className,
}: WorkflowPlayerProps) {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(initialWorkflowId);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const activeWorkflow: WorkflowDefinition = WORKFLOWS[selectedWorkflowId] || WORKFLOWS["golden-path"];
  const currentStep = activeWorkflow.steps[currentStepIndex];

  useEffect(() => {
    if (onStepChange && currentStep) {
      onStepChange(currentStep);
    }
  }, [currentStep, onStepChange]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= activeWorkflow.steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const timer = setTimeout(() => setCurrentStepIndex((prev) => prev + 1), 4500);
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, activeWorkflow.steps.length]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < activeWorkflow.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleWorkflowSelect = (id: string) => {
    setIsPlaying(false);
    setSelectedWorkflowId(id);
    setCurrentStepIndex(0);
  };

  const progressPercent = ((currentStepIndex + 1) / activeWorkflow.steps.length) * 100;

  return (
    <div
      className={`rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-background to-blue-500/5 p-4 shadow-sm space-y-3 ${
        className || ""
      }`}
    >
      {/* Workflow Selector & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-amber-500 text-slate-950 font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Guided walkthrough
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-semibold text-foreground">
                Step {currentStepIndex + 1} of {activeWorkflow.steps.length}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <select
                aria-label="Choose a walkthrough"
                value={selectedWorkflowId}
                onChange={(e) => handleWorkflowSelect(e.target.value)}
                className="w-full max-w-[240px] sm:max-w-sm text-sm font-semibold bg-background border rounded-md p-2 cursor-pointer text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {Object.values(WORKFLOWS).map((wf) => (
                  <option key={wf.id} value={wf.id} className="bg-background text-foreground">
                    {wf.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stepper Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="h-8 w-8 p-0"
            title="Previous Step"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant={isPlaying ? "destructive" : "default"}
            onClick={() => {
              if (!isPlaying && currentStepIndex === activeWorkflow.steps.length - 1) setCurrentStepIndex(0);
              setIsPlaying(!isPlaying);
            }}
            className="h-8 px-3 gap-1.5 text-xs font-semibold bg-amber-500 text-slate-950 hover:bg-amber-400 border border-amber-400 shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" /> {currentStepIndex === activeWorkflow.steps.length - 1 ? "Replay" : "Auto-play"}
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleNext}
            disabled={currentStepIndex === activeWorkflow.steps.length - 1}
            className="h-8 w-8 p-0"
            title="Next Step"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleReset}
            className="h-8 w-8 p-0 text-muted-foreground"
            title="Reset Workflow"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <Progress value={progressPercent} className="h-1.5 bg-amber-500/20" />

      <div className="flex flex-wrap gap-2" aria-label="Walkthrough steps">
        {activeWorkflow.steps.map((step, index) => (
          <button key={step.stepNumber} type="button" aria-label={`Step ${index + 1}: ${step.title}`} aria-current={index === currentStepIndex ? "step" : undefined} title={step.title} onClick={() => { setIsPlaying(false); setCurrentStepIndex(index); }} className={`h-9 min-w-9 rounded-md border px-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${index === currentStepIndex ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-accent"}`}>
            {index + 1}
          </button>
        ))}
      </div>

      {/* Active Step Annotation Card */}
      {currentStep && (
        <div className="p-3.5 rounded-lg border bg-card/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in-50 duration-200">
          <div className="space-y-1 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                {currentStep.stepNumber}. {currentStep.title}
              </span>
              <Badge variant="outline" className="text-[10px] font-mono bg-background">
                {currentStep.documentNumber}
              </Badge>
              <Badge variant="golden" className="text-[10px]">
                {currentStep.badge}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Role: <span className="text-foreground font-medium">{currentStep.role}</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
              <Button asChild size="sm" className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 text-white">
                <Link href={currentStep.route}>Open this step
                <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
          </div>
        </div>
      )}
    </div>
  );
}
