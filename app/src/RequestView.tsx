import { useState } from 'react'
import { TextInput, View } from 'react-native'
import type { Action, DemoRole, Workflow } from '../../shared/workflow.ts'
import { Body, Button, Card, Muted, Title } from './ui'
import { colors, typography } from './theme'
export function RequestView({ workflow, role, act, help }: { workflow: Workflow; role: DemoRole; act: (a: Action) => void; help: () => void }) {
  const [response, setResponse] = useState('')
  return <View style={{ gap: 16 }}><Title>Requests</Title><Muted>Your assigned broker: Alex · fictional demo broker. Responses stay in this session.</Muted>
    {workflow.requests.map(r => <Card key={r.id}>
      <Body>Police reference · {r.required ? 'Required for demo' : 'Optional'}</Body>
      <Body>Status: {r.status}</Body><Muted>{r.reason}</Muted>
      {r.response ? <Body>Shop response: {r.response}</Body> : <Muted>No response yet.</Muted>}
      {r.status === 'clarification needed' && <Muted>Broker: Please clarify the reference and the report date using fictional details.</Muted>}
      {role === 'Shop' && ['requested', 'clarification needed'].includes(r.status) && <>
        <TextInput accessibilityLabel="Fictional police reference response" placeholder="e.g. DEMO-CAS-123, reported 13 Nov" value={response} onChangeText={setResponse} multiline maxLength={2000} style={{ ...typography.body, color: colors.ink, minHeight: 80, borderWidth: 1, borderColor: colors.line, borderRadius: 8, padding: 12 }} />
        <Button label="Send response to demo broker" disabled={!response.trim()} onPress={() => { act({ type: 'answer', id: r.id, response }); setResponse('') }} />
        <Button label="Help me answer" kind="ghost" onPress={help} />
      </>}
      {role === 'Broker' && r.status === 'answered' && <>
        <Button label="Accept response" onPress={() => act({ type: 'accept', id: r.id })} />
        <Button label="Request clarification" kind="ghost" onPress={() => act({ type: 'clarify', id: r.id })} />
      </>}
      <Muted>Next: {r.status === 'accepted' ? 'Broker checks the rest of the file.' : r.status === 'answered' ? 'Broker reviews this response.' : 'Shop supplies the requested information.'}</Muted>
    </Card>)}
  </View>
}
