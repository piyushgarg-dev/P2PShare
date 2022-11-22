import React from 'react'
import { fabric } from 'fabric'
import Popover from '@mui/material/Popover'
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { BsFillPenFill, BsSquare } from 'react-icons/bs'
import { FaRegCircle } from 'react-icons/fa'
import { GiArrowCursor } from 'react-icons/gi'
import { IoMdColorPalette } from 'react-icons/io'
import { Socket } from 'socket.io-client'
import { SocketContext } from 'context/SocketContext'

enum TOOL {
  PEN = 1,
  SQUARE,
  CIRCLE,
  SELECT,
}

interface WhiteBoardProps {
  remoteSocketId?: string
}

const WhiteBoard: React.FC<WhiteBoardProps> = (props) => {
  const { remoteSocketId } = props

  const socket = React.useContext(SocketContext) as Socket

  const { editor, onReady } = useFabricJSEditor()
  const [selectedTool, setSelectedTool] = React.useState<TOOL | null>(null)

  const [colorSelectActive, setColorSelectActive] =
    React.useState<boolean>(false)

  const [colorSelectAnchor, setColorSelectAnchor] = React.useState()

  const COLORS = React.useMemo(
    () => ['#000', '#dc2626', '#65a30d', '#2563eb', '#c026d3'],
    []
  )
  const [activeColor, setActiveColor] = React.useState<string | null>(COLORS[0])

  const handleSelectColor = React.useCallback(
    (color: string) => setActiveColor(color),
    []
  )

  React.useEffect(() => {
    if (activeColor && editor) {
      //@ts-ignore
      editor.setFillColor()
      editor.setStrokeColor(activeColor)
      editor.canvas.freeDrawingBrush.color = activeColor
      socket.emit('whiteboard:drawing', {
        action: 'COLOR_CHANGE',
        value: activeColor,
        to: remoteSocketId,
      })
      setColorSelectActive(false)
    }
  }, [activeColor, remoteSocketId])

  React.useEffect(() => {
    if (editor) {
      editor.canvas.isDrawingMode = true
      editor.canvas.freeDrawingBrush.width = 20
    }
  }, [])

  React.useEffect(() => {
    if (selectedTool && editor) {
      switch (selectedTool) {
        case TOOL.SELECT:
          editor.canvas.isDrawingMode = false
          break
        case TOOL.PEN:
          editor.canvas.isDrawingMode = true
          break
        case TOOL.CIRCLE:
          editor.addCircle()
          editor.canvas.isDrawingMode = false
          break
        case TOOL.SQUARE:
          editor.addRectangle()
      }
      socket.emit('whiteboard:drawing', {
        action: 'TOOL_CHANGE',
        value: selectedTool,
        to: remoteSocketId,
      })
    }
  }, [selectedTool])

  const handleIncommingWhiteBoardData = React.useCallback(
    (data) => {
      const { action, value } = data.data

      if (action === 'WHITEBOARD_CHANGE') {
        editor?.canvas.loadFromJSON(value, () => {
          editor?.canvas.renderAll()
        })
      }
      // if (action === 'TOOL_CHANGE') {
      //   const tool = value as TOOL
      //   setSelectedTool(tool)
      // } else if (action === 'COLOR_CHANGE') {
      //   const color = value as string
      //   setActiveColor(color)
      // }
    },
    [editor]
  )

  const handleCanvasChange = React.useCallback(() => {
    const _json = editor?.canvas.toJSON()

    socket.emit('whiteboard:drawing', {
      action: 'WHITEBOARD_CHANGE',
      value: _json,
      to: remoteSocketId,
    })
  }, [editor, remoteSocketId])

  React.useEffect(() => {
    socket.on('whiteboard:data', handleIncommingWhiteBoardData)

    return () => {
      socket.off('whiteboard:data', handleIncommingWhiteBoardData)
    }
  }, [editor])

  React.useEffect(() => {
    if (editor) {
      editor.canvas.on('mouse:up', handleCanvasChange)
    }
  }, [editor, remoteSocketId])

  return (
    <>
      <FabricJSCanvas
        className="mb-2 h-[74vh] w-full rounded-md bg-white"
        onReady={onReady}
      />
      <div className="h-[5vh] w-full  rounded-lg bg-slate-600">
        <div
          className="flex h-full w-full items-center justify-evenly"
          id="tools-container"
        >
          <GiArrowCursor
            className={`${selectedTool === TOOL.SELECT && 'text-sky-500'}`}
            onClick={(e) => setSelectedTool(TOOL.SELECT)}
          />
          <BsFillPenFill
            onClick={(e) => setSelectedTool(TOOL.PEN)}
            className={`${selectedTool === TOOL.PEN && 'text-sky-500'}`}
          />
          <IoMdColorPalette
            className="rounded-full p-1"
            aria-describedby="colorPickerIcon"
            aria-owns={colorSelectActive ? 'colorPickerIcon' : undefined}
            onClick={() => setColorSelectActive(true)}
            style={{ backgroundColor: activeColor || undefined }}
          />
          <FaRegCircle
            onClick={(e) => setSelectedTool(TOOL.CIRCLE)}
            className={`${selectedTool === TOOL.CIRCLE && 'text-sky-500'}`}
          />
          <BsSquare
            onClick={(e) => setSelectedTool(TOOL.SQUARE)}
            className={`${selectedTool === TOOL.SQUARE && 'text-sky-500'}`}
          />
        </div>
      </div>
      <Popover
        onClose={(e) => setColorSelectActive(false)}
        open={colorSelectActive}
        id="colorPickerIcon"
        anchorReference="anchorPosition"
        anchorPosition={{ top: 200, left: 400 }}
      >
        <div className="min-h-[200px] max-w-[200px] rounded-md bg-transparent bg-white p-2 shadow-md">
          <Grid container spacing={1}>
            {COLORS &&
              COLORS.map((color) => (
                <Grid key={color} item>
                  <div
                    onClick={(e) => handleSelectColor(color)}
                    className={`min-h-[60px] min-w-[60px] cursor-pointer rounded-md`}
                    style={{ backgroundColor: color }}
                  />
                </Grid>
              ))}
          </Grid>
        </div>
      </Popover>
    </>
  )
}

export default WhiteBoard
