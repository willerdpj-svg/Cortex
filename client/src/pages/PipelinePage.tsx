import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useDeals, useCreateDeal, useMoveDealStage } from '../hooks/useDeals';
import { useProspects } from '../hooks/useProspects';
import PipelineColumn from '../components/deals/PipelineColumn';
import DealForm from '../components/deals/DealForm';
import Modal from '../components/ui/Modal';
import { DEAL_STAGES } from '../lib/constants';
import type { Deal } from '../types';
import toast from 'react-hot-toast';

export default function PipelinePage() {
  const navigate = useNavigate();
  const { data: deals, isLoading } = useDeals();
  const { data: prospects } = useProspects();
  const moveStageMutation = useMoveDealStage();
  const createDealMutation = useCreateDeal();
  const [showCreate, setShowCreate] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const dealsByStage = DEAL_STAGES.reduce((acc, stage) => {
    acc[stage] = (deals || []).filter((d: Deal) => d.stage === stage);
    return acc;
  }, {} as Record<string, Deal[]>);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as number;
    const newStage = over.id as string;

    // Check if dropped on a stage column
    if (DEAL_STAGES.includes(newStage as any)) {
      const deal = (deals || []).find((d: Deal) => d.id === dealId);
      if (deal && deal.stage !== newStage) {
        moveStageMutation.mutate({ id: dealId, stage: newStage }, {
          onSuccess: () => toast.success(`Moved to ${newStage}`),
        });
      }
    }
  };

  return (
    <div className="p-6 h-screen flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} /> New Deal
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {DEAL_STAGES.map(stage => (
              <PipelineColumn
                key={stage}
                stage={stage}
                deals={dealsByStage[stage] || []}
                onDealClick={id => navigate(`/deals/${id}`)}
              />
            ))}
          </div>
        </DndContext>
      )}

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Deal" wide>
        <DealForm
          prospects={prospects || []}
          onSubmit={data => {
            createDealMutation.mutate(data as Partial<Deal>, {
              onSuccess: () => { setShowCreate(false); toast.success('Deal created'); },
            });
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>
    </div>
  );
}
