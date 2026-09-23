import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ fire: vi.fn() }));
vi.mock('sweetalert2', () => ({ default: { fire: mocks.fire } }));
import { showInfo } from './feedback';
describe('showInfo', () => { beforeEach(()=>mocks.fire.mockReset()); it('shows informational toast', () => { showInfo('Info','Details'); expect(mocks.fire).toHaveBeenCalledWith(expect.objectContaining({ title:'Info', text:'Details', icon:'info', toast:true })); }); });
