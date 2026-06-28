'use client'

import { useState } from 'react'
import { roundCents } from '@/utils/money'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutlined'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import ReceiptIcon from '@mui/icons-material/Receipt'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Menu from '@mui/material/Menu'
import { SurfaceCard } from '@/components/ui'
import { brand } from '@/lib/theme'
import { SPLIT_CATS, splitMoney, fmtMonthShort, type SplitMonth, type MonthTotals, type BalanceStatus, type SplitExpense, type SplitSettlement } from '@/data/splitData'
import { CatBadge, PayerTag, SplitBar, SplitStatusChip, SummaryStat, PersonAvatar } from './SplitPrimitives'
import type { ExpenseDraft } from './SplitDialogs'

function navBtnSx(enabled: boolean) {
  return {
    width: 28,
    height: 28,
    borderRadius: '8px',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: '#fff',
    color: enabled ? 'text.secondary' : 'text.disabled',
    opacity: enabled ? 1 : 0.5,
    '&:hover': enabled ? { bgcolor: brand.zinc[50] } : {},
  }
}

export function SummaryStrip({
  month,
  totals,
  status,
  partnerName,
  cents,
  canPrev,
  canNext,
  onPrev,
  onNext,
  onSettle,
}: {
  month: SplitMonth
  totals: MonthTotals
  status: BalanceStatus
  partnerName: string
  cents: boolean
  canPrev: boolean
  canNext: boolean
  onPrev: () => void
  onNext: () => void
  onSettle: () => void
}) {
  const settledNote = totals.settledTotal > 0 ? `${splitMoney(totals.settledTotal, cents)} settled this month` : null
  const headline =
    status.state === 'settled'
      ? `You and ${partnerName} are square for ${month.label}.`
      : status.state === 'owe'
      ? `You owe ${partnerName} for this month.`
      : `${partnerName} owes you for this month.`

  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', p: '18px 22px 16px' }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: '12px' }}>
            <IconButton size="small" onClick={onPrev} disabled={!canPrev} sx={navBtnSx(canPrev)}>
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography sx={{ fontSize: 13.5, fontWeight: 600, minWidth: 110, textAlign: 'center', letterSpacing: '-0.01em' }}>
              {month.label}
            </Typography>
            <IconButton size="small" onClick={onNext} disabled={!canNext} sx={navBtnSx(canNext)}>
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <SplitStatusChip status={status} size="lg" cents={cents} />
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: '10px', maxWidth: 340, lineHeight: 1.45 }}>
            {headline}{settledNote ? ` · ${settledNote}.` : ''}
          </Typography>
        </Box>
        <Button
          variant={status.state === 'settled' ? 'outlined' : 'contained'}
          startIcon={<SwapHorizIcon />}
          onClick={onSettle}
          sx={{ height: 38, flex: 'none' }}
        >
          Settle up
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', p: '16px 22px 18px', borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.default' }}>
        <SummaryStat label="Total spent" value={splitMoney(totals.total, cents)} />
        <SummaryStat label="You paid" value={splitMoney(totals.youPaid, cents)} color={brand.anchor[700]} />
        <SummaryStat label={`${partnerName} paid`} value={splitMoney(totals.themPaid, cents)} />
      </Box>
    </SurfaceCard>
  )
}

function ExpenseRowMenu({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)
  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)} sx={{ width: 28, height: 28, borderRadius: '8px', color: 'text.disabled', '&:hover': { bgcolor: brand.zinc[100], color: 'text.secondary' } }}>
        <MoreHorizIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 168, p: '6px' } } }}>
        <MenuItem onClick={() => { setAnchor(null); onEdit() }} sx={{ borderRadius: '8px', gap: 1.25, fontSize: 13.5 }}>
          <EditIcon sx={{ fontSize: 16, color: 'text.disabled' }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { setAnchor(null); onRemove() }} sx={{ borderRadius: '8px', gap: 1.25, fontSize: 13.5, color: 'error.main' }}>
          <DeleteIcon sx={{ fontSize: 16 }} /> Remove
        </MenuItem>
      </Menu>
    </>
  )
}

function InlineEditor({
  expense,
  partnerName,
  onSave,
  onCancel,
}: {
  expense: SplitExpense
  partnerName: string
  onSave: (patch: Partial<ExpenseDraft>) => void
  onCancel: () => void
}) {
  const [desc, setDesc] = useState(expense.desc)
  const [amount, setAmount] = useState(String(expense.amount))
  const [date, setDate] = useState(expense.date ?? '')
  const [payer, setPayer] = useState(expense.payer)
  const [splitYou, setSplitYou] = useState(expense.splitYou)
  const [cat, setCat] = useState(expense.cat)

  const valid = desc.trim() !== '' && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0

  return (
    <Box sx={{ p: '16px 18px', borderBottom: '1px solid', borderColor: 'divider', bgcolor: brand.anchor[50] }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '14px' }}>
        <EditIcon sx={{ fontSize: 14, color: brand.anchor[700] }} />
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: brand.anchor[700] }}>Editing expense</Typography>
      </Box>
      <Box sx={{ bgcolor: '#fff', borderRadius: '10px', border: '1px solid', borderColor: 'divider', p: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <TextField label="Description" value={desc} onChange={(e) => setDesc(e.target.value)} size="small" fullWidth autoFocus />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="Amount ($)" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} size="small" slotProps={{ htmlInput: { inputMode: 'decimal' } }} />
          <TextField label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} size="small" slotProps={{ inputLabel: { shrink: true } }} />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <Select size="small" value={payer} onChange={(e) => setPayer(e.target.value)} displayEmpty>
            <MenuItem value="you">You paid</MenuItem>
            <MenuItem value="them">{partnerName} paid</MenuItem>
          </Select>
          <Select size="small" value={cat} onChange={(e) => setCat(e.target.value)}>
            {Object.entries(SPLIT_CATS).map(([k, v]) => (
              <MenuItem key={k} value={k}>{v.label}</MenuItem>
            ))}
          </Select>
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '6px' }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary' }}>
              You {splitYou}% · {partnerName} {100 - splitYou}%
            </Typography>
            {splitYou !== 50 && (
              <Button size="small" variant="text" onClick={() => setSplitYou(50)} sx={{ fontSize: 11.5, p: '2px 6px', minWidth: 0, color: brand.anchor[700] }}>Reset 50/50</Button>
            )}
          </Box>
          <SplitBar splitYou={splitYou} height={7} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1 }}>
            {(['you', 'them'] as const).map((who) => {
              const val = who === 'you' ? splitYou : 100 - splitYou
              return (
                <Box key={who} sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 40, px: '10px', border: '1px solid', borderColor: 'divider', borderRadius: '8px', bgcolor: '#fff' }}>
                  <PersonAvatar who={who} partnerName={partnerName} size={20} />
                  <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: 'text.secondary', flex: 1 }}>{who === 'you' ? 'You' : partnerName}</Typography>
                  <input
                    type="number"
                    value={val}
                    min={0}
                    max={100}
                    onChange={(e) => {
                      const n = Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                      setSplitYou(who === 'you' ? n : 100 - n)
                    }}
                    style={{ width: 36, textAlign: 'right', border: 'none', background: 'transparent', fontFamily: 'inherit', fontSize: 14, fontWeight: 600 }}
                  />
                  <Typography sx={{ fontSize: 13, color: 'text.disabled', fontWeight: 600 }}>%</Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.25, mt: '14px' }}>
        <Button variant="text" onClick={onCancel} sx={{ color: 'text.secondary' }}>Cancel</Button>
        <Button
          variant="contained"
          startIcon={<CheckIcon />}
          disabled={!valid}
          onClick={() => onSave({ desc: desc.trim(), amount: roundCents(parseFloat(amount)), date: date || null, payer, cat, splitYou, splitThem: 100 - splitYou })}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  )
}

function ExpenseRow({
  expense,
  partnerName,
  cents,
  compact,
  onSave,
  onRemoveRequest,
}: {
  expense: SplitExpense
  partnerName: string
  cents: boolean
  compact: boolean
  onSave: (id: string, patch: Partial<ExpenseDraft>) => void
  onRemoveRequest: (e: SplitExpense) => void
}) {
  const [editing, setEditing] = useState(false)
  const cat = SPLIT_CATS[expense.cat] ?? SPLIT_CATS.other
  const youShare = expense.amount * (expense.splitYou / 100)
  const themShare = expense.amount * (expense.splitThem / 100)

  if (editing) {
    return (
      <InlineEditor
        expense={expense}
        partnerName={partnerName}
        onCancel={() => setEditing(false)}
        onSave={(patch) => { onSave(expense.id, patch); setEditing(false) }}
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '34px minmax(0,1fr) auto 168px 96px 30px',
        alignItems: 'center',
        gap: '14px',
        p: compact ? '9px 16px' : '13px 16px',
        borderBottom: '1px solid',
        borderColor: 'divider',
        '&:hover': { bgcolor: brand.zinc[50] },
        transition: 'background 0.15s',
      }}
    >
      <CatBadge cat={expense.cat} size={34} />
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {expense.desc}
        </Typography>
        <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: '2px' }}>
          {expense.date ? fmtMonthShort(expense.date) : 'No date'} · {cat.label}
        </Typography>
      </Box>
      <PayerTag who={expense.payer} partnerName={partnerName} />
      <Box>
        <SplitBar splitYou={expense.splitYou} height={5} />
        <Typography sx={{ fontSize: 11.5, color: 'text.secondary', mt: '5px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>
          <Box component="span" sx={{ color: brand.anchor[700], fontWeight: 600 }}>You {splitMoney(youShare, cents)}</Box>
          {' · '}
          <Box component="span" sx={{ color: 'text.disabled' }}>{partnerName} {splitMoney(themShare, cents)}</Box>
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 14.5, fontWeight: 600, textAlign: 'right', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>
        {splitMoney(expense.amount, cents)}
      </Typography>
      <ExpenseRowMenu onEdit={() => setEditing(true)} onRemove={() => onRemoveRequest(expense)} />
    </Box>
  )
}

export function ExpenseLedger({
  expenses,
  partnerName,
  cents,
  compact,
  onAdd,
  onSave,
  onRemoveRequest,
}: {
  expenses: SplitExpense[]
  partnerName: string
  cents: boolean
  compact: boolean
  onAdd: () => void
  onSave: (id: string, patch: Partial<ExpenseDraft>) => void
  onRemoveRequest: (e: SplitExpense) => void
}) {
  return (
    <SurfaceCard>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: '16px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Expenses</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.disabled', fontVariantNumeric: 'tabular-nums' }}>{expenses.length}</Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<AddIcon />} onClick={onAdd} sx={{ height: 32 }}>Add expense</Button>
      </Box>
      {expenses.length === 0 ? (
        <Box sx={{ p: '48px 24px', textAlign: 'center' }}>
          <Box sx={{ width: 46, height: 46, mx: 'auto', mb: '14px', borderRadius: '12px', bgcolor: brand.zinc[100], display: 'grid', placeItems: 'center' }}>
            <ReceiptIcon sx={{ fontSize: 22, color: 'text.disabled' }} />
          </Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>No expenses yet</Typography>
          <Typography sx={{ fontSize: 13, color: 'text.secondary', mt: '5px', mb: '16px' }}>Add the first shared expense for this month.</Typography>
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={onAdd}>Add expense</Button>
        </Box>
      ) : (
        <Box>
          {expenses.map((e) => (
            <ExpenseRow key={e.id} expense={e} partnerName={partnerName} cents={cents} compact={compact} onSave={onSave} onRemoveRequest={onRemoveRequest} />
          ))}
        </Box>
      )}
    </SurfaceCard>
  )
}

export function SettlementHistory({
  settlements,
  partnerName,
  cents,
  onRemoveRequest,
}: {
  settlements: SplitSettlement[]
  partnerName: string
  cents: boolean
  onRemoveRequest: (s: SplitSettlement) => void
}) {
  if (settlements.length === 0) return null
  return (
    <SurfaceCard>
      <Box sx={{ p: '14px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Settlements</Typography>
      </Box>
      <Box>
        {settlements.map((s) => {
          const youPaid = s.fromPayer === 'you'
          return (
            <Box key={s.id} sx={{ display: 'flex', alignItems: 'center', gap: '12px', p: '12px 20px', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ width: 30, height: 30, flex: 'none', borderRadius: '999px', bgcolor: brand.anchor[50], display: 'grid', placeItems: 'center', color: brand.anchor[700] }}>
                <SwapHorizIcon sx={{ fontSize: 15 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 13.5, fontWeight: 600 }}>
                  {youPaid ? `You paid ${partnerName}` : `${partnerName} paid you`}
                </Typography>
                {s.date && (
                  <Typography sx={{ fontSize: 12, color: 'text.disabled', mt: '1px' }}>
                    {fmtMonthShort(s.date)}
                  </Typography>
                )}
              </Box>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: brand.anchor[700], fontVariantNumeric: 'tabular-nums' }}>
                {splitMoney(s.amount, cents)}
              </Typography>
              <IconButton size="small" onClick={() => onRemoveRequest(s)} sx={{ width: 28, height: 28, borderRadius: '8px', color: 'text.disabled', '&:hover': { bgcolor: brand.zinc[100], color: 'text.secondary' } }}>
                <CloseIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Box>
          )
        })}
      </Box>
    </SurfaceCard>
  )
}

