import { create } from 'zustand';
import * as fabric from 'fabric';
/**
 * 전자 도장 이미지 타입
 */
export interface Stamp {
  id: string;
  src: string;
  name: string;
}

/**
 * 전역 상태 타입 정의
 */
interface StoreState {
  // PDF 파일 상태
  file: File | null;
  setFile: (file: File | null) => void;

  // 전자 도장 이미지 상태
  stamps: Stamp[];
  addStamp: (stamp: Stamp) => void;
  removeStamp: (stampId: string) => void;

  // 현재 선택된 도장
  selectedStamp: Stamp | null;
  selectStamp: (stamp: Stamp | null) => void;

  // Fabric 캔버스 상태 (UI 객체)
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas | null) => void;

  // 캔버스 위의 도장 이미지 객체
  stampObject: fabric.Image | null;
  setStampObject: (stampObject: fabric.Image | null) => void;
}

/**
 * Zustand 스토어 생성
 */
export const useStore = create<StoreState>((set) => ({
  // PDF 파일 상태
  file: null,
  setFile: (file: File | null) => set({ file }),

  // 전자 도장 이미지 상태
  stamps: [],
  addStamp: (stamp: Stamp) =>
    set((state) => ({
      stamps: state.stamps.length < 5 ? [...state.stamps, stamp] : state.stamps,
    })),
  removeStamp: (stampId: string) =>
    set((state) => ({
      stamps: state.stamps.filter((stamp) => stamp.id !== stampId),
      selectedStamp: state.selectedStamp?.id === stampId ? null : state.selectedStamp,
    })),

  // 현재 선택된 도장
  selectedStamp: null,
  selectStamp: (stamp: Stamp | null) => set({ selectedStamp: stamp }),

  // Fabric 캔버스 상태 (UI 객체)
  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) => set({ canvas }),

  // 캔버스 위의 도장 이미지 객체
  stampObject: null,
  setStampObject: (stampObject: fabric.Image | null) => set({ stampObject }),
}));
